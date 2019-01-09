import React, { Component } from 'react';
import { Grid } from "semantic-ui-react";

import Routes from './components/routes';
import NavMenu from './components/nav/NavMenu';
import SteemConnect from './auth';

//import {checkStatus, parseJson} from './helpers';

import './styles/App.css';

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

    this.state = {
      isAuth: false,
      user: ''
    }

    this.user = {};
  }

  setUserData = (user) => {
    this.user = user;
  }

  getUserData = () => {
    return this.user;
  }

  extractAccessToken = async () => {
    const url = new URLSearchParams(window.location.search);

    if (url.has('access_token')) {
      window.history.pushState(null, '', window.location.origin);
      const expiresAt = url.get('expires_in') * 1000 + new Date().getTime();
      const accessToken = url.get('access_token');
      const user = url.get('username');
//console.log('expiresAt: ', new Date(expiresAt));
//console.log('accessToken', accessToken);
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('expires_at', expiresAt);
      localStorage.setItem('username', user);

      SteemConnect.setAccessToken(accessToken);
      console.log('new token return');
      return true;
      /*const auth = {
        username: user,
        accessToken: accessToken,
        expiresAt: expiresAt
      }*/
      /*console.log('extract return');
      return await this.validateToken(accessToken);*/

      //reroute to previous url?
    }else {
      const accessToken = this.getToken();
      if (accessToken) {
        console.log('existing token return');
        SteemConnect.setAccessToken(accessToken);
        return true;
        //steemconnect.me();

        //return await this.validateToken(accessToken);


        //if valid response from .me(), set state as loggedIn: true
      }
      console.log('no token return');
      return false;
    }
  }

  validateToken = async (t) => {
    //if (accessToken) {
      //SteemConnect.setAccessToken(accessToken);
      console.log('t1: ', t);
    if (t) {
      await SteemConnect.me((err, result) => {
        console.log('/me', err, result);
        if (!err) {
          console.log('res: ', result.account);
          this.setUserData(result.account);

          console.log('validateToken return');
          return true;
          /*this.setState({
            user: result.account
          });*/
          //this.meta = JSON.stringify(result.user_metadata, null, 2);
        }
      })
    }
      /*.then(() => {
        console.log('isAuth return');
        return this.isAuth();
        //cb(t);
      });*/
    //}
  }

  isAuth = async (isAuth) => {
    console.log('t2 isAuth: ', isAuth);
    /*console.log('this.getUserData(): ', this.getUserData());
    return !!this.getUserData();*/
    if (isAuth) {
      console.log('isAuth pre-setState:', isAuth);
      this.setState({
        isAuth: isAuth
      });
    }else {console.log('false extract');}
  };

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

  authenticate = () => {
    /*if (data) {
      console.log('isAuth pre-setState:', data);
      this.setState({
        isAuth: data
      });
    }*/
    /*this.extractAccessToken()
      .then((isAuth) => {
      console.log('isAuth function return before setState: ', isAuth);
      this.setState({
        isAuth: isAuth
      });
    });*/
    /*this.setState({
      isAuth: true
    });*/
    //const isAuth = ;
    this.extractAccessToken()
    .then(this.validateToken)
    /*.then((isAuth) => {
      if (isAuth) {
        console.log('isAuth pre-setState:', isAuth);
        this.setState({
          isAuth: isAuth
        });
      }else {console.log('false extract');}
    })*/
    .then(this.isAuth)
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
    console.log(new Date());
    this.authenticate();
    /*Promise.all([this.extractAccessToken(), this.validateToken()]).then(this.authenticate);*/
  }

  /*componentWillMount() {
    this.authenticate();
  }*/

  render () {
    //console.log("loggedinstate: ", this.state.isLoggedIn);
    const {
      isAuth,
    } = this.state;

    //this.authenticate();

    console.log('isAuth from state: ', isAuth);
    //console.log('t:' , this.getToken());

    return (
      <div>
        <Grid className="navMenu">
          <Grid.Column>
            <NavMenu isAuth={isAuth} /> {/*hambuger menu https://codepen.io/markcaron/pen/pPZVWO*/
                          /*https://codepen.io/designosis/pen/LbMgya*/
                        }
          </Grid.Column>
        </Grid>

        <Grid container className="wrapper">
          <Grid.Column width={16}>
            {/*
              <a href={SteemConnect.getLoginURL(next)}>
              state: Data that will be passed to the callbackURL for your app after the user has logged in.
            */}
            <Routes scURL={SteemConnect.getLoginURL()} onLogout={this.onLogout}/>
          </Grid.Column>
        </Grid>
      </div>
    );

  }
}

export default App;
