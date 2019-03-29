/**
 *  Settings for the Steem Connect API.
 */

const scConfig = {
  sc: {
    app: 'kure.app',
    callbackURLDev: 'https://localhost:3000/success',
    callbackURLProd: 'https://thekure.net/success',
    //accessToken: 'access_token',
    scope: ['login', 'offline', 'vote', 'comment', 'delete_comment', 'comment_options', 'custom_json'],
  }
};

export default scConfig;
