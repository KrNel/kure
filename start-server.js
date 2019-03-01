import app from './server/server';
import fs from 'fs';
import https from 'https';

const httpsOptions =
  process.env.NODE_ENV === 'production'
  ? {
    key: fs.readFileSync('/etc/letsencrypt/live/thekure.net/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/thekure.net/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/thekure.net/chain.pem')
  }
  : {
    key: fs.readFileSync('ssl/privateKey.key'),
    cert: fs.readFileSync('ssl/certificate.crt')
  };

https.createServer(httpsOptions, app).listen(app.get('port'), () => {
  console.log(`Find the server at: https://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
