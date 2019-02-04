import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import morgan from 'morgan';
import helmet from 'helmet';
//import dotenv from 'dotenv';

import config from './config';
import auth from './routes/auth/auth';
import recentPosts from './routes/api/recentPosts';
import groups from './routes/api/groups';
import manage from './routes/manage/manage';

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

let db;
MongoClient.connect(`mongodb://${config.db.host}:${config.db.port}`, { useNewUrlParser: true }).then(connection => {
	db = connection.db(config.db.name);
	app.locals.db = db;
}).catch(err => {
	throw new Error ('DB ERROR: ', err);
});

app.use('/auth', auth);
app.use('/api/recentposts', recentPosts);
app.use('/api/groups', groups);
app.use('/manage', manage);

app.use((err, req, res) => {
  throw new Error ('Something went wrong in the server: ', err);
})

export default app;
