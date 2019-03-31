import sc2 from 'steemconnect';
import scConfig from './scConfig'

/**
 *  Instantiate the Steem Connect API.
 */
const api = sc2.Initialize({
  app: scConfig.sc.app,
  callbackURL: process.env.NODE_ENV === 'development' ? scConfig.sc.callbackURLDev : scConfig.sc.callbackURLProd,
  scope: scConfig.sc.scope,
});

export default api;
