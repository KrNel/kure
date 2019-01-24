import app from './server/server';
import fs from 'fs';
import https from 'https';

const httpsOptions = {
  key: fs.readFileSync('ssl/privateKey.key'),
  cert: fs.readFileSync('ssl/certificate.crt')
};

https.createServer(httpsOptions, app).listen(app.get('port'), () => {
  console.log(`Find the server at: https://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
