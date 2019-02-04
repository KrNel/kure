import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

import { handleLogin } from '../../actions/authActions';
import Loading from '../Loading/Loading';

/**
 *  Handles Steem Connect login responses.
 *
 *  Displays a loading spinner while user is authenticated.
 *  After authentication, user is redirected to previous page.
 *
 *  @param {object} props - Component props
 *  @param {bool} props.isAuth - Determines if user is authenticated
 *  @param {bool} props.dispatch - Redux function to dispatch actions
 *  @returns {Component} - Shows a loading spinner, then redirects user
 */
class AuthSC extends Component {

  static propTypes = {
    isAuth: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

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

  /**
   *  Gathers response data from Steem Coneect, and dispatches login reducer.
   */
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

/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - Authentication data
 */
const mapStateToProps = state => {
  const { isAuth } = state.auth;

  return {
    isAuth
  }
}

export default connect(mapStateToProps)(AuthSC)
