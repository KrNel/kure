import { Router } from 'express';
import Tokens from 'csrf';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import config from '../../config';
import SteemConnect from '../../../client/src/utilities/auth/scAPI';

const router = new Router();

router.use(bodyParser.json());
router.use(cookieParser());

let tokens = new Tokens();
const ORIGIN_HOST = `${config.app.client.host}:${config.app.client.port}`;

router.post('/validate', (req, res, next) => {

  if (ORIGIN_HOST !== req.headers['x-forwarded-host']) res.json({"isAuth": false});

  const db = req.app.locals.db;
  const isAuth = false;
  const expiresAt = req.body.expiresAt;
  const accessToken = req.body.accessToken;
  const user = req.body.user;

  //verify accessToken on SteemConnect, not fake
  validateToken(accessToken)
    .then(valid => {
      if (valid) return setTokenCookie(res, expiresAt, accessToken)
    }).then(set => {
      if (set) return initUser(db, res, user)
    }).then(init => {
      if (init) return newCSRF(db, res, user)
    }).then(isAuth => {
      if (isAuth) res.json({ isAuth: isAuth, user: user });
    }).catch(err => console.error(err) );
})

const validateToken = (accessToken) => {
  //what happens if stemconnect is offline? test it
  return new Promise((resolve, reject) => {
    SteemConnect.setAccessToken(accessToken);
    SteemConnect.me((err, result) => {
      (!err) ? resolve(true) : reject(false);
    })
    resolve(true);
  });
}

const setTokenCookie = (res, expiresAt, accessToken) => {
  return new Promise((resolve, reject) => {
    res.cookie(config.SC_COOKIE, accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: expiresAt
    });
    resolve(true);
  });
}

const initUser = (db, res, user) => {

  return new Promise((resolve, reject) => {
    let success = false;
    try {
      //add to DB for returning user persistence
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
      console.error(err);
      res.status(500).json({ message: `initUser DB upsert: ${err}` });
    }
    resolve(success);
  })
}

const newCSRF = (db, res, user) => {
/*console.log('req: ', req);
console.log('res: ', res);
console.log('user: ', user);*/
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
      console.error(err);
      res.status(500).json({ message: `newCSRF DB upsert: ${err}` });
    }

    if (success) res.set(config.CSRF_TOKEN, csrf);
    resolve(success);
  })
}



/**
 *
 *
 */
router.get('/returning', (req, res, next) => {
console.log('1: ', 1)
  if (ORIGIN_HOST !== req.headers['x-forwarded-host']) res.json({isAuth: false, user:''}); //log the CSRF attempt?

  const db = req.app.locals.db;
  const accessToken = req.cookies[config.SC_COOKIE];

  returning(db, res, accessToken)
    .then(ret => {
      res.json(ret);
    })
    .catch(err => { console.error(err); });
})

const returning = async (db, res, accessToken) => {
  const fail = {isAuth: false, user:''};
  if (!accessToken) return fail;

  SteemConnect.setAccessToken(accessToken);
  SteemConnect.me((err, result) => {
    if (err) return fail;
  })

  const user = jwt.decode(accessToken)['user'];
  return (newCSRF(db, res, user))
    ? {
        isAuth: true,
        user: {
          name: user
        }
      }
    : fail;
}

/*
  https://stackoverflow.com/questions/23494956/how-to-use-morgan-logger
  https://github.com/strongloop/strong-error-handler
  https://stackoverflow.com/questions/43054203/nodejs-expressjs-how-to-log-errors-for-the-production-server
  */

/**
 *
 *
 */
router.post('/logout', (req, res, next) => {
  const db = req.app.locals.db;
  const user = req.body.user;

  if (!user) res.json({invalid: true})

  logout(db, res, user)
    .then(loggedOut => res.json({loggedOut: loggedOut}))
    .catch(err => {
      //next(err);
      console.error(err);
      //res.status(500).json({ message: `/auth/logout: ${err}` });
    });
})

const logout = async (db, res, user) => {

  res.clearCookie(config.SC_COOKIE);

  try {
    db.collection('sessions').deleteOne({"user": user});
  }catch (err) {
    console.error(err);
    //res.status(500).json({ message: `/auth/logout DB delete: ${err}` });
  }
//SteemConnect.options.accessToken
  await SteemConnect.revokeToken((err, ret) => {
    if (!ret || err) {
      console.error('Error in revokeToken');
    }
    //if (err) throw new Error ('error in revokeToken');
  });

  return true;
}

export default router;
