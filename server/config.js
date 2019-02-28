import scConfig from '../client/src/utils/auth/scConfig';

const config = {
  env: "development",
  app: {
    client: {
      host: "localhost",
      port: 3000
    },
    server: {
      host: "localhost",
      port: 3001
    },
  },
  db: {
    host: '127.0.0.1',
    port: 27017,
    name: 'kure'
  },
  sc: {
    app: scConfig.app,
    callbackURLDev: scConfig.callbackURLDev,
    callbackURLProd: scConfig.callbackURLProd,
    accessToken: scConfig.accessToken,
    scope: scConfig.scope,
  },
  scCookie: "SC-TOKEN",
  csrfToken: "x-csrf-token"
};

export default config;
