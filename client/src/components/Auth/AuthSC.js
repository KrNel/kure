import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { handleLogin } from '../../actions/authActions';

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

    const { dispatch } = this.props;
    dispatch(handleLogin(expiresAt, accessToken, user));
  }

  render() {
    const { isAuth } = this.props;
    let { redirect } = this.state;
    if (isAuth) redirect = true;

    return (
      <div>
        {
          (redirect)
            ? (<Redirect to={this.redirectURL} />)
            : (<Loading active inline='centered' size='huge' text='Logging in...' />)
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { isAuth } = state.auth;

  return {
    isAuth
  }
}

export default connect(mapStateToProps)(AuthSC)
