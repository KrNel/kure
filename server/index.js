import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import morgan from 'morgan';
import helmet from 'helmet';
import serialize from 'serialize-javascript';
//stringify-entities?
//html-escaper
//node-esapi
import xss from 'xss';
//express-rate-limit
import Tokens from 'csrf';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import config from '../config'
import SteemConnect from '../client/src/utilities/auth/scAPI'

const ORIGIN_HOST = `${config.app.client.host}:${config.app.client.port}`;

const app = express();
app.set('port', (config.app.server.port || 3001));
if (config.app.env !== 'TEST') {
  app.use(morgan('combined'));
}

//set headers on nginx sever when setup
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
MonogDB SECURITY
https://scalegrid.io/blog/10-tips-to-improve-your-mongodb-security/
https://docs.mongodb.com/manual/security/
https://docs.mongodb.com/manual/administration/security-checklist/
*/
let db;
MongoClient.connect(`mongodb://${config.db.host}:${config.db.port}`, { useNewUrlParser: true }).then(connection => {
	db = connection.db(config.db.name);
}).catch(err => {
	console.error('DB ERROR:', err);
});

app.use(cookieParser());
let tokens = new Tokens();
const SC_COOKIE = "SC-TOKEN";
const CSRF_TOKEN = "x-csrf-token";

/**
 *
 *
 */
//add same origin check for dev/prod header? ignore if from elsewhere
//const forwardFrom = req.headers['x-forwarded-host'];
app.post('/auth/validate', (req, res, next) => {
  if (ORIGIN_HOST !== req.headers['x-forwarded-host']) res.json({"isAuth": false});
  const isAuth = false;
  //console.log('body: ', req.body);
  //console.log('headers: ', req.headers);
  const expiresAt = req.body.expiresAt;
  const accessToken = req.body.accessToken;
  const user = req.body.user;

  //verify accessToken on SteemConnect, not fake
  validateToken(accessToken)
    .then(setTokenCookie(res, expiresAt, accessToken))
    .then(newCSRF(res, user))
    .then((isAuth) => {
      res.json({ "isAuth": isAuth, "user": user });
    })
    .catch(err => { console.error(err); });
})

const validateToken = async (accessToken) => {
  //what happens if stemconnect is offline? test it
  await SteemConnect.setAccessToken(accessToken);
  await SteemConnect.me((err, result) => {
    return (!err) ? true : false;
  })
  return true;
}

const setTokenCookie = (res, expiresAt, accessToken) => {
  res.cookie(SC_COOKIE, accessToken, {
    secure: true,
    httpOnly: true,
    maxAge: expiresAt
  });
  return true;
}

const newCSRF = (res, user) => {
  const secret = tokens.secretSync();
  const csrf = tokens.create(secret);

  try {
    //add to DB for returning user persistence
    db.collection('sessions').updateOne(
      { "user": user },
      {
        $set:
        {
          "user": user,
          "csrf": csrf
        }
      },
      { upsert: true }
    )
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: `newCSRF DB upsert: ${err}` });
  }

  res.set(CSRF_TOKEN, csrf);
  return true;
}

/**
 *
 *
 */
app.get('/auth/returning', (req, res, next) => {
  if (ORIGIN_HOST !== req.headers['x-forwarded-host']) res.json({"isAuth": false, "user":''}); //log the CSRF attempt?
//console.log(req.headers);

  //const csrfHeader = req.header[CSRF_TOKEN];
  const accessToken = req.cookies[SC_COOKIE];
//console.log('accessToken: ', accessToken);
  returning(res, accessToken)
    .then((ret) => {
      res.json(ret);
    })
    .catch(err => { console.error(err); });
})

const returning = async (res, accessToken) => {
  const fail = {"isAuth": false, "user":''};
  if (!accessToken) return fail;

  SteemConnect.setAccessToken(accessToken);
  SteemConnect.me((err, result) => {
    if (err) return fail;
  })

  const user = jwt.decode(accessToken)['user'];
  return (newCSRF(res, user))
    ? {
        "isAuth": true,
        "user": {
          "name": user
        }
      }
    : fail;
  /*const ret = await new Promise((resolve, reject) => {
    db.collection('sessions').findOne({"csrf": csrfHeader}, {user: 1},  (err, result) => {
      err
        ? reject(err)
        : resolve({isAuth: true, user: { user: result.user }});
    })
  });*/
  //return ret;
}

const validateRequest = (req, user) => {
  const csrfHeader = req.header[CSRF_TOKEN];
  db.collection('sessions').findOne({"user": user}, {"csrf": true},  (err, result) => {
    if (err) { console.error('err: ', err); }
    if (result !== null && result.csrf === csrfHeader) {
      return true;
    }
    return false;
  });
}

/**
 *
 *
 */
app.post('/auth/logout', (req, res, next) => {
  const user = req.body.user;
  console.log('user: ', user);
  logout(res, user)
    .then(loggedOut => res.json({loggedOut: loggedOut}))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: `/auth/logout: ${err}` });
    });
})

const logout = async (res, user) => {
  //revoke token doesnt work, SC lib error
  /*await SteemConnect.revokeToken((err, ret) => {
    if (err) throw new Error ('error in revokeToken');
  });*/

  try {
    db.collection('sessions').deleteOne({"user": user});
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: `/auth/logout DB delete: ${err}` });
  }

  res.clearCookie(SC_COOKIE);
  return true;
}



app.get('/api/recentposts', (req, res, next) => {
  db.collection('posts').find().limit(10).toArray().then(posts => {
		res.json({ posts: posts })
	}).catch(error => {
		console.error(error);
		res.status(500).json({ message: `Internal Server Error with mongodb: ${error}` });
	});
})

//const initialState = serialize(response);
//var html = xss('<script>alert("xss");</script>');
/* Add a new group */
app.post('api/groups', (request, response, next) => {

})
/* Get group */
app.get('api/groups/:id', (request, response, next) => {

})
/* Update a user */
app.put('/groups/:id', (request, response, next) => {

})
/* Delete a user */
app.delete('/groups/:id', (request, response, next) => {

})


/*app.post('/auth/validate', (req, res, next) => {

  console.log('Inside: POST /auth/validate callback function');
  console.log('body: ', req.body);
  console.log('headers: ', req.headers);
  res.status(200).json({ auth: true });
  //const url = getLoginURL();

  //x-forwarded-host
  //origin - cant be added by JS
  //referer - cant be added by JS
})*/


export default app;
