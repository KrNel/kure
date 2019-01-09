import React, { Component } from 'react';
import { Grid } from "semantic-ui-react";

import Routes from './routes/Routes';
import NavMenu from './components/Nav/NavMenu';
import HelmetComponent from './components/Header/Header';
import SteemConnect from './utilities/auth';
import Cookies from 'universal-cookie';


//import {checkStatus, parseJson} from './helpers';

import './App.css';

//const config = require('config.json');
//http://jasonwatmore.com/post/2018/08/06/nodejs-jwt-authentication-tutorial-with-example-api
//https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
//https://github.com/auth0/express-jwt
//https://auth0.com/docs/api-auth/tutorials/verify-access-token#how-can-i-validate-the-claims-
//https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4

/*
import logo from './logo.svg';
import './App.css';
import "semantic-ui-css/semantic.css";
*/

/*
Make fixed width main, option to choose fluid width?
*/
class App extends Component {
  constructor (props) {
    super(props);

    const cookies = new Cookies();

    this.state = {
      isAuth: false,
      isLoading: false,
      //user: ''
    }

    this.user = {};
  }

  setUserData = (user) => {
    this.user = user;
  }

  getUserData = () => {
    return this.user;
  }

  /*
  move this to proper component for complete login redirect from SC
  */
  extractAccessToken = async (url) => {
    const redirect = url.get('state')
    //window.history.pushState(null, '', window.location.origin);
    window.history.replaceState(null, null, window.location.pathname);
    const expiresAt = url.get('expires_in') * 1000 + new Date().getTime();
    const accessToken = url.get('access_token');
    const user = url.get('username');



    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('username', user);

    /*await*/ SteemConnect.setAccessToken(accessToken);

    /*await*/  this.validateToken()
      .then(this.isAuth)
      .then(window.location.href = redirect)
      .catch(err => console.log(err));
  }

  validateToken = async () => {
    /*
    maybe can verify headers comes from stemconnect faster?
    */
    /*
    what happens if stemconnect is offline? test it!
    */
    await SteemConnect.me((err, result) => {
      //console.log('/me', err, result);
      if (!err) {
        this.setUserData(result.account);
      }else return false;
    })
    return true;
    //https://stackoverflow.com/questions/42187045/return-true-actually-returns-undefined-using-async
  }

  isAuth = async (valid) => {
    if (valid) {
      this.setState({
        isAuth: true
      });
      return true;
    }
    return false;
  };

  /*
  -- validate token in local DB, instead of calling .me each time?
  - after first SC.me(), put token into DB
  - when requesting pur pushing data with authorization required, just make sure the token is in the DB, and that the expiresIn isn't past 'new Date()'.
  - maybe keep it as expiresIn? easier to see if its 0 or less?
  */
  /*validateToken = async (data) => {
    fetch('/auth/validate', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
    }).then(checkStatus)
      .then(parseJson)
      .then((res) => {
      console.log("data: ", res);

      return data.auth;
    });
  }*/

  newAuthenticate = (url) => {
    //https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html
    this.extractAccessToken(url);
  }

  authenticate = () => {
    const accessToken = this.getToken();
    if (accessToken) {
      SteemConnect.setAccessToken(accessToken);
      this.validateToken()
        .then(this.isAuth)
        .catch(err => console.log(err));
    }
  }

  getToken = () => {
    return localStorage.getItem('access_token');
  }

  /*
  //https://medium.freecodecamp.org/how-to-make-authentication-easier-with-json-web-token-cc15df3f2228
  //https://github.com/auth0/node-jsonwebtoken
  //https://www.google.com/search?biw=1129&bih=950&ei=d9EqXPf0CarYjwSE9pqQAw&q=node+authenticate+jwt+on+app+load&oq=node+authenticate+jwt+on+app+load&gs_l=psy-ab.3...3290.3290..3926...0.0..0.148.148.0j1......0....1..gws-wiz.......0i71.ix_Rp_KptoY
  verifyCredsStorage = () => {
    jwt.verify(token,"samplesecret",(err,decod)=>{
      //your logic
    })
  }
  */
  /*
  I suggest putting a function on your server endpoints that check the authentication on almost any request and make sure you send the JWT back to the server so that it can be digested
  */
  /*
  Put tokenin state?
  On requests to validate token at server end, if fail, response on clinet needs to delete localStorage

  https://medium.appbase.io/securing-a-react-web-app-with-server-side-authentication-1b7c7dc55c16
  https://medium.appbase.io/securing-a-react-web-app-with-authorization-rules-2e43bf5592ca
  */
  onLogout = () => {
    this.setState({
      isAuth: false
    });
  }

  componentDidMount() {
    if (!this.state.isAuth) {
      const url = new URLSearchParams(window.location.search);
      if (url.has('access_token')) {
        this.newAuthenticate(url);
      }else {
        this.authenticate();
      }
    }

    /*Promise.all([this.extractAccessToken(), this.validateToken()]).then(this.authenticate);*/
  }

  render () {
    const {
      isAuth,
    } = this.state;

    const scState = `${window.location.pathname}`;
    const loginURL = SteemConnect.getLoginURL(scState);

    return (
      <div>
        <HelmetComponent title='KURE - Remedy for STEEM' description='Kindred United to Reward Everyone' />

        <Grid className="navMenu">
          <Grid.Column>
            <NavMenu scURL={loginURL} isAuth={isAuth} />
            {
              /*hambuger menu https://codepen.io/markcaron/pen/pPZVWO*/
              /*https://codepen.io/designosis/pen/LbMgya*/
            }
          </Grid.Column>
        </Grid>

        <Grid container className="wrapper">
          <Grid.Column width={16}>
            <Routes onLogout={this.onLogout} isAuth={isAuth} />
          </Grid.Column>
        </Grid>
      </div>
    );

  }
}

export default App;
