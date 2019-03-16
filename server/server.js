import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import {createLogger, format, transports} from 'winston';
const { combine, timestamp, label, printf, json, prettyPrint } = format;
import 'winston-daily-rotate-file';


import config from './config';
import api from './routes/api/api';


const app = express();

dotenv.config();

//app.set('env', config.env);
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', (config.app.server.port || 3001));

const logDir = './server/logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

if (process.env.NODE_ENV === "production") {
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms', {stream: fs.createWriteStream(path.join(__dirname, './logs/access.log'), {flags: 'a'})}));
}
else {
  app.use(morgan("combined")); //log to console on development
}

const enumerateErrorFormat = format(info => {
  if (info.message instanceof Error) {
    info.message = Object.assign({
      message: info.message.message,
      stack: info.message.stack
    }, info.message);
  }

  if (info instanceof Error) {
    return Object.assign({
      message: info.message,
      stack: info.stack
    }, info);
  }

  return info;
});

const logger = createLogger({
  format: format.combine(
    enumerateErrorFormat(),
    format.json(),
    prettyPrint(),
  ),
  transports: [
    new transports.Console()
  ]
});

/*// Error as message
console.log('Run FIRST test...');
logger.log({ level: 'error', message: new Error('FIRST test error') });

// Error as info (one argument)
console.log('\nRun SECOND test...');
const err = new Error('SECOND test error');
err.level = 'info';
logger.info(err);

// Error as info (two arguments);
console.log('\nRun THIRD test...');
logger.log('info', new Error('THIRD test error'));*/


//app.locals.logger = logger;
//logger.error(new Error('whatever'));

//Set headers on responses
//TODO: set headers on nginx sever when setup
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

//MongoDB connection to persist in app
let db;
const mongoURL =
  process.env.NODE_ENV === 'production'
  ? process.env.MONGO_URL
  : `mongodb://${config.db.host}:${config.db.port}`;

MongoClient.connect(mongoURL, { useNewUrlParser: true }).then(connection => {
	db = connection.db(config.db.name);
  //persist db connection in app.locals
	app.locals.db = db;
}).catch(err => {
	console.error('MongoDB Connection Error: ', err);
});

/*app.get('/hey', (req, res) => {
  res.send('HEY!')
})
*/
// logger api
app.post('/api/logger', (req, res) => {
  logger.log(req.body);
  res.json({msg: 'OK'});
});

//Routes for React fetchs
app.use('/api', api);
/*
app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});


*/
app.use((err, req, res) => {
  logger.log({level: 'error', message: err});
  //res.json({ error: 'Something failed!' })
})

export default app;
