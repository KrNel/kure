import sc2 from 'steemconnect';
import scConfig from './scConfig'

const api = sc2.Initialize({
  app: scConfig.sc.app,
  callbackURL: scConfig.sc.callbackURLDev,
  //callbackURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/callback' : 'https://appbaseio-apps.github.io/reactivesearch-auth0-example/callback',
  accessToken: scConfig.sc.accessToken,
  scope: scConfig.sc.scope,
});

/*
const api = sc2.Initialize({
  app: process.env.STEEMCONNECT_CLIENT_ID,
  baseURL: process.env.STEEMCONNECT_HOST,
  callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
});
*/

export default api;
/*
export const removeToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('expires_at');
console.log("loggedout");
  this.props.action();
  //this.setState({isLoggedIn: false});
}
*/
