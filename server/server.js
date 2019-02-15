import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import morgan from 'morgan';
import helmet from 'helmet';
//import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import {createLogger, format, transports} from 'winston';
const { combine, timestamp, label, printf, json, prettyPrint } = format;
import 'winston-daily-rotate-file';


import config from './config';
import auth from './routes/auth/auth';
import api from './routes/api/api';
import manage from './routes/manage/manage';

const app = express();

app.set('env', config.env);
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', (config.app.server.port || 3001));

/*const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}*/
//const filename = path.join(logDir, 'results.log');
if (config.env !== 'TEST') {
  app.use(morgan('combined'));
}
/*
if (app.get("env") === "production") {
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms', {stream: fs.createWriteStream(path.join(__dirname, './logs/access.log'), {flags: 'a'})}));
}
else {
  app.use(morgan("combined")); //log to console on development
}
*/



//Log server settings
let transportInfo = new transports.DailyRotateFile({
  name:"infofile",
  filename: './server/logs/all/log-%DATE%.log',
  handleExceptions: true,
  datePattern: 'YYYY-MM-DD',
  level: app.get("env") === 'production' ? 'info' : 'debug',
  prettyPrint: true,
});

//Filter error messages from log
let transportError = new transports.DailyRotateFile({
  name:"errorfile",
  filename: './server/logs/errors/errors-%DATE%.log',
  handleExceptions: true,
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  prettyPrint: true,
});

let logger = createLogger({
  level: app.get("env") === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    json(),
    prettyPrint(),
  ),
  transports: [
    transportInfo,
    transportError,
    /*new transports.Console({ level: 'error' }),*/
  ],
  exitOnError: false,
});


/*if (app.get("env") !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(
        info =>
          `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
      ),
    )
  }));
}

//app.locals.logger = logger;

/*const transports = {
  console: new transports.Console({ level: 'info' }),
  file: new transports.File({ filename: 'combined.log', level: 'info' })
};*/

/*logger.log({
  level: 'info',
  message: 'Hello distributed log files!'
});

logger.info('Hello again distributed logs');*/

/*
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
    format.json()
  ),
  transports: [
    new transports.Console()
  ]
});
*/

//logger.error(new Error('whatever'));

//Set headers on responses
//TODO: set headers on nginx sever when setup
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))


//MongoDB connection to persist in app
let db;
MongoClient.connect(`mongodb://${config.db.host}:${config.db.port}`, { useNewUrlParser: true }).then(connection => {
	db = connection.db(config.db.name);
  //persist db connection in app.locals
	app.locals.db = db;
}).catch(err => {
	throw new Error ('MongoDB Connectioon Error: ', err);
});

// logger api
app.post('/logger', ( req, res ) => {
  logger.log(req.body);
  res.send( 'OK' );
});

//Routes for React fetchs
app.use('/auth', auth);
app.use('/api', api);
app.use('/manage', manage);



app.use((err, req, res) => {
  logger.log({level: 'error', message: err});
  res.status(500).send({ error: 'Something failed!' })
})

export default app;
