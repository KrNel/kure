import React, { Component } from 'react';
import { Grid } from "semantic-ui-react";
import axios from 'axios';

import Routes from './routes/Routes';
import NavMenu from './components/Nav/NavMenu';
import HelmetComponent from './components/Header/Header';
import SteemConnect from './utilities/auth/scAPI';
import './App.css';


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
      isAuthorizing: true,
    }

    this.userData = { name: '' };
    this.csrf = "";
    this.signal = axios.CancelToken.source();
  }

  componentDidMount() {
    if (!this.state.isAuth) {
      this.isReturning();
    }
  }

  componentWillUnmount() {
    this.signal.cancel('Api is being canceled');
  }

  setUserData = (userData) => {
    this.userData = userData;
  }

  getUserData = () => {
    return this.userData;
  }

  setCSRF = (csrf) => {
    this.csrf = csrf;
  }

  getCSRF = () => {
    return this.csrf;
  }

  handleIsAuth = (isAuth) => {
    this.setState({
      isAuth: isAuth
    });
  };
  handleIsAuthorizing = (isAuthorizing) => {
    this.setState({
      isAuthorizing: isAuthorizing
    });
  };

  onLogout = () => {
    this.setState({
      isAuth: false
    });
  }

  isReturning() {
    axios.get('/auth/returning', {
      cancelToken: this.signal.token,
    }).then((res) => {
      const isAuth = res.data.isAuth;
      if (isAuth) {
        this.setCSRF(res.headers['x-csrf-token']);
        this.setUserData(res.data.user);
        this.handleIsAuth(isAuth);
      }
      this.handleIsAuthorizing(false);
    }).catch(err => {
      if (axios.isCancel(err)) {
        console.log('Error: ', err.message); // => prints: Api is being canceled
      }
    })

    /*fetch('/auth/returning', {
      method: 'get',
      headers: {
        "Content-Type": "application/json",
      }
    }).then(checkStatus)
      .then(res => {
        this.setCSRF(res.headers.get('x-csrf-token'));
        return res;
      })
      .then(parseJson)
      .then((res) => {
        if (res.isAuth) {
          this.handleIsAuth(res.isAuth);
          this.setUserData(res.user);
        }
        this.handleIsAuthorizing(false);
      });*/
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

  render () {
    const {
      isAuth,
      isAuthorizing
    } = this.state;
    const user = this.getUserData().name;
    const scState = `${window.location.pathname}`;
    const loginURL = SteemConnect.getLoginURL(scState);
    const csrfToken = this.getCSRF();

    return (
      <div>
        <HelmetComponent title='KURE - Curation Network Remedy for Steem' description='Kindred United to Reward Everyone' />

        <Grid className="navMenu">
          <Grid.Column>
            <NavMenu isAuth={isAuth} loginURL={loginURL} />
            {
              /*hambuger menu https://codepen.io/markcaron/pen/pPZVWO*/
              /*https://codepen.io/designosis/pen/LbMgya*/
            }
          </Grid.Column>
        </Grid>

        <Grid container className="wrapper">
          <Grid.Column width={16}>
            <Routes onLogout={this.onLogout} isAuth={isAuth} handleIsAuth={this.handleIsAuth} handleIsAuthorizing={this.handleIsAuthorizing} isAuthorizing={isAuthorizing} user={user} setUserData={this.setUserData} setCSRF={this.setCSRF} csrfToken={csrfToken} />
          </Grid.Column>
        </Grid>
      </div>
    );

  }
}

export default App;
