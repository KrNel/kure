import sc2 from 'steemconnect';
import scConfig from './scConfig'

/**
 *  Instantiate the Steem Connect API.
 */
const api = sc2.Initialize({
  app: scConfig.sc.app,
  callbackURL: scConfig.sc.callbackURLDev,
  //callbackURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/callback' : 'https://appbaseio-apps.github.io/reactivesearch-auth0-example/callback',
  accessToken: scConfig.sc.accessToken,
  scope: scConfig.sc.scope,
});

export default api;
