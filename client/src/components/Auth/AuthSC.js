import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

//import Error from '../Error/Error';
import Loading from '../Loading/Loading';

class AuthSC extends Component {
  constructor(props) {
    super(props);

    this.redirectURL = "/";

    this.state = {
      redirect: false,
    };
  }

  componentDidMount() {
    const url = new URLSearchParams(window.location.search);
    if (url.has('access_token')) {
      this.authTokenServer(url);
    }else {
      this.setState({ redirect: true });
    }
  }

  authTokenServer = (url) => {
    let redirect = url.get('state')
    if (redirect === 'success' || redirect === 'login') redirect = '/';
    this.redirectURL = redirect;
    window.history.replaceState(null, null, window.location.pathname);
    const expiresAt = url.get('expires_in') * 1000 + new Date().getTime();
    const accessToken = url.get('access_token');
    const user = url.get('username');

    axios.post('/auth/validate', {
      expiresAt: expiresAt,
      accessToken: accessToken,
      user: user
    }).then((res) => {
      this.props.setCSRF(res.headers['x-csrf-token']);
      this.props.handleIsAuthorizing(false);
      if (res.data.isAuth) {
        this.props.setUserData({name: user});
        this.props.handleIsAuth(true);
        this.setState({ redirect: true });
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  render() {
    return (
      <div>
        {
          (this.state.redirect)
            ? (<Redirect to={this.redirectURL} />)
            : (<Loading active inline='centered' size='huge' text='Logging in...' />)
        }
      </div>
    )
  }
}

export default AuthSC;
