import sc2 from 'steemconnect';

const api = sc2.Initialize({
  app: 'demo-app',
  callbackURL: 'http://localhost:3000',
  //callbackURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/callback' : 'https://appbaseio-apps.github.io/reactivesearch-auth0-example/callback',
  accessToken: 'access_token',
  scope: ['vote', 'comment'],
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
