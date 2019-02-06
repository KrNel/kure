import { Router } from 'express';
import Tokens from 'csrf';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import config from '../../config';
import SteemConnect from '../../../client/src/utilities/auth/scAPI';

const router = new Router();
const ORIGIN_HOST = `${config.app.client.host}:${config.app.client.port}`;
let tokens = new Tokens();

router.use(bodyParser.json());
router.use(cookieParser());

/**
 *  POST route to authenticate a new login.
 *  Route: /auth/login
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  and group to delete from.
 *  CSRF validation is done. If valid, proceed with database query.
 *  Database inserted object will be returned to the frontend.
 */
router.post('/login', (req, res) => {
  const db = req.app.locals.db;
  const expiresAt = req.body.expiresAt;
  const accessToken = req.body.accessToken;
  const user = req.body.user;

  //Verify accessToken from cookie through SteemConnect
  validateToken(accessToken)
    .then(valid => {
      //Set Steem Connect token into cookie response
      if (valid) return setTokenCookie(res, expiresAt, accessToken)
    }).then(set => {
      //Insert initial user login to the DB
      if (set) return initUser(db, user)
    }).then(init => {
      //Genreate a new CSRF token for the session collection
      if (init) return newCSRF(db, res, user)
    }).then(isAuth => {
      //Return authentication object
      if (isAuth) res.json({ isAuth: isAuth, user: {name: user} });
    }).catch(err => console.error(err) );
})

/*
//Check if forwarded header matches ORIGIN from config settings
const originPass = () => {
  return new Promise((resolve) => {
    if (ORIGIN_HOST !== req.headers['x-forwarded-host']) {
      res.json({"isAuth": false});
      resolve(false);
    }
    resolve(true);
  });
}
*/

/**
 *  Verify access token from connection attempt.
 *
 *  @param {string} accessToken SteemConnect generated token
 *  @returns {boolean} Determines if token is valid
 */
const validateToken = (accessToken) => {
  //TODO:what happens if stemconnect is offline? test it
  return new Promise((resolve, reject) => {
    SteemConnect.setAccessToken(accessToken);
    SteemConnect.me((err, result) => {
      (!err) ? resolve(true) : reject(false);
    })
    resolve(true);
  });
}

/**
 *  Create the cookie to store the SteemConnect access token
 *
 *  @param {object} res Reponse to send to frontend
 *  @param {string} expiresAt Time token expires at
 *  @param {string} accessToken SteemConnect generated token
 *  @returns {boolean} Determines if token is valid
 */
const setTokenCookie = (res, expiresAt, accessToken) => {
  return new Promise((resolve) => {
    res.cookie(config.scCookie, accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: expiresAt
    });
    resolve(true);
  });
}

/**
 *  Insert a logged in user into the DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} user Logging in user name
 *  @returns {boolean} Determines if user was inserted
 */
const initUser = (db, user) => {
  return new Promise((resolve, reject) => {
    let success = false;
    try {
      //Add to DB for returning user persistence
      const joined = new Date();
      db.collection('users').updateOne(
        {user: user},
        {
          $setOnInsert: {
            name: user,
            display: user,
            joined: joined,
            votes: {
              curating: 0,
              writing: 0
            },
            posts: {
              curating: 0,
              writing: 0
            },
            owned_kgroups: 0,
						owned_limit: 4
          }
        },
        { upsert:true }
      )
      success = true;
    }catch (err) {
      reject(success);
      throw new Error('Error with initUser in DB: ', err);
    }
    resolve(success);
  })
}

/**
 *  Create new CSRF token, insert into 'sessions' collection,
 *  and create a cookie.
 *
 *  @param {object} db MongoDB connection
 *  @param {object} res Reponse to send to frontend
 *  @param {string} user Logging in user name
 *  @returns {boolean} Determines CSRF creation was successful
 */
const newCSRF = (db, res, user) => {
  return new Promise((resolve, reject) => {

    const secret = tokens.secretSync();
    const csrf = tokens.create(secret);
    let success = false;
    try {
      //add to DB for returning user persistence
      db.collection('sessions').updateOne(
        { user: user },
        {
          $set:
          {
            user: user,
            csrf: csrf,
          }
        },
        { upsert: true }
      )
      success = true;
    }catch (err) {
      reject(success);
      throw new Error('Error with newCSRF DB: ', err);
    }

    if (success) res.set(config.csrfToken, csrf);
    resolve(success);
  })
}

/**
 *  POST route to authenticate a returning user.
 *  Route: /auth/returning
 *
 *  Gets the local DB object and the SteemConnect token from the cookie.
 *  Validates token with SteemConnect api to authenticate returning user.
 *  Responds with authentication object
 */
router.get('/returning', (req, res) => {
  if (ORIGIN_HOST !== req.headers['x-forwarded-host']) res.json({isAuth: false, user:''}); //log the CSRF attempt?

  const db = req.app.locals.db;
  const accessToken = req.cookies[config.scCookie];

  returning(db, res, accessToken)
    .then(ret => {
      res.json(ret);
    })
    .catch(err => {
      throw new Error('Error returning in DB: ', err);
    });
})

/**
 *  Create new CSRF token, insert into 'sessions' collection,
 *  and create a cookie.
 *
 *  @param {object} db MongoDB connection
 *  @param {object} res Reponse to send to frontend
 *  @param {string} accessToken SteemConnect generated token
 *  @returns {object} Determines if returning user is authenticated
 */
const returning = async (db, res, accessToken) => {
  const fail = {isAuth: false, user:''};
  if (!accessToken) return fail;

  //Validate stored token with SteemConnect api
  const isValidToken = await validateToken(accessToken);
  if (!isValidToken) return fail;

  //Extract user name from the token for use in frontend app
  const user = jwt.decode(accessToken)['user'];

  //Return authenticated object based on CSRF validation
  return (newCSRF(db, res, user))
    ? {
        isAuth: true,
        user: {
          name: user
        }
      }
    : fail;
}

/**
 *  POST route to logout a user.
 *  Route: /auth/logout
 *
 *  Gets the local DB object and the user from request body.
 *  If no one was logged in, the logout process terminates.
 *  Once user session is removed, logout is succcessful.
 */
router.post('/logout', (req, res) => {
  const db = req.app.locals.db;
  const user = req.body.user;

  //Return to frontend if no username sent in request
  if (!user) res.json({invalid: true})

  //Logout the user from SteemConnect and session, return success
  logout(db, res, user)
    .then(loggedOut => res.json({loggedOut: loggedOut}))
    .catch(err => {
      throw new Error('Error logout with DB: ', err);
    });
})

/**
 *  Create new CSRF token, insert into 'sessions' collection,
 *  and create a cookie.
 *
 *  @param {object} db MongoDB connection
 *  @param {object} res Reponse to send to frontend
 *  @param {string} user Logged in user name
 *  @returns {boolean} Determines if logout was successful
 */
const logout = async (db, res, user) => {
  //Get rid of the cookie which stored the SteemConnect token
  res.clearCookie(config.scCookie);

  try {
    //Remove the sessions for the user
    db.collection('sessions').deleteOne({"user": user});
  }catch (err) {
    throw new Error('Error logout from DB: ', err);
  }
  //Revoke the token from SteemConnect
  SteemConnect.revokeToken((err, ret) => {
    if (!ret || err) {
      //console.error('Error in revokeToken');
    }
    //if (err) throw new Error ('error in revokeToken');
  });

  return true;
}

export default router;
