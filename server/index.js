import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import serialize from 'serialize-javascript';
//stringify-entities?
//html-escaper
import xss from 'xss';

import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

import { getLoginURL } from '../client/src/utilities/auth';

const app = express();
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.set('port', (process.env.API_PORT || 3001));

if (process.env.NODE_ENV !== 'TEST') {
  app.use(morgan('combined'));
}

/*
MonogDB SECURITY
https://scalegrid.io/blog/10-tips-to-improve-your-mongodb-security/
https://docs.mongodb.com/manual/security/
https://docs.mongodb.com/manual/administration/security-checklist/
*/
let db;
let collection = "kure";
MongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }).then(connection => {
	db = connection.db(collection);
	/*app.listen(3001, () => {
	console.log('App started on port 3001');
});*/
}).catch(error => {
	console.log('ERROR:', error);
});
/*if (process.env.NODE_ENV !== 'TEST') {
  app.use(morgan('combined'));
}*/

/*mongoose.connect(
  'mongodb://localhost:27017/kure'
).catch(console.error);*/



app.get('/api/recentposts', (req, res, next) => {
  //console.log(req.headers);
  db.collection('posts').find().toArray().then(posts => {
    //send the Cookie with CSFR token here, add entryin DB?
    //future POST to this server, client needs to send header (and cookie) with token to match

    //or
    //get the JWT from steemconnect here, send back decoded jwt to client (inot cookie?) to set isAuth: true.
    //httponly secure cookie? only need to reed it on server side on revisits to reauthorize jwt token?

    //store a custom server-side token for user with expiry time matching token, then requests need to be validated, use that token, which only is created after SteemConnect token is validated. that way, SC token is never stored or used apart from first sign in.
    //to auto login, keep the custom token in cookie, and connect to server to see if auth expiration is still valid, if not, respond telling client to auth via SteemConnect again


    //what about authenticating on revisit of page?


		res.json({ posts: posts })
	}).catch(error => {
		console.log(error);
		res.status(500).json({ message: `Internal Server Error: ${error}` });
	});
})

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

//const initialState = serialize(response);
//var html = xss('<script>alert("xss");</script>');
app.post('/auth/validate', (req, res, next) => {
  console.log('Inside: POST /auth/validate callback function');
  console.log('body: ', req.body);
  res.json({ auth: true });
  //const url = getLoginURL();
})

/*app.get('/login/sc', (req, res, next) => {
  const url = "https://steemconnect.com/oauth2/authorize?client_id=demo-app&redirect_uri=http%3A%2F%2Flocalhost%3A3000&scope=vote,comment";
  console.log('Inside: POST /login callback function');
  //console.log('URL: ', req.body.url);
  //const url = getLoginURL();
})*/

export default app;
