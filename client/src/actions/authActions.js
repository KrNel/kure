import axios from 'axios';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

import SteemConnect from '../utils/auth/scAPI';
import {SC_COOKIE} from '../settings';

export const REQUEST_RETURNING = 'REQUEST_RETURNING';
export const RECEIVE_RETURNING = 'RECEIVE_RETURNING';
export const CANCEL_RETURNING = 'CANCEL_RETURNING';
export const ERROR_RETURNING = 'ERROR_RETURNING';
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export const RECEIVE_LOGOUT = 'RECEIVE_LOGOUT';
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';
export const CANCEL_LOGIN = 'CANCEL_LOGIN';
export const RECEIVE_CSRF = 'RECEIVE_CSRF';

/**
 *  Action creator for requesting returning user athentication.
 *
 *  @return {object} The action data
 */
export const requestReturning = () => ({
  type: REQUEST_RETURNING
});

/**
 *  Action creator for requesting returning user athentication.
 *
 *  @param {object} res Results of the database fetch
 *  @return {object} The action data
 */
export const receiveReturning = (res) => ({
  type: RECEIVE_RETURNING,
  isAuth: true,
  isAuthorizing: false,
  user: res.user,
  authedAt: Date.now()
})

export const receiveCSRF = (token) => ({
  type: RECEIVE_CSRF,
  csrf: token,
})

/**
 *  Action creator for erroring returning user athentication.
 *
 *  @param {object} res Results of the database fetch
 *  @return {object} The action data
 */
export const errorReturning = (res) => ({
  type: ERROR_RETURNING,
  isAuth: false,
  isAuthorizing: false,
  user: '',
  csrf: '',
  authedAt: '',
})

/**
 *  Action creator for cancelling the return login process.
 */
export const cancelReturning = () => ({
  type: CANCEL_RETURNING,
})

/**
 *  Action creator for requesting a logout.
 *
 *  @returns {object} The action data
 */
export const requestLogout = () => ({
  type: REQUEST_LOGOUT
});

/**
 *  Action creator for receiving a logout from the database.
 *
 *  @returns {object} The action data
 */
export const receiveLogout = () => ({
  type: RECEIVE_LOGOUT
});

/**
 *  Action creator for requesting a login.
 *
 *  @param {string} user User name
 *  @returns {object} The action data
 */
export const requestLogin = (user) => ({
  type: REQUEST_LOGIN,
  user,
});

/**
 *  Action creator for receiving user login from database.
 *
 *  @param {object} res Results of the database fetch
 *  @returns {object} The action data
 */
export const receiveLogin = (res) => ({
  type: RECEIVE_LOGIN,
  isAuth: res.data.isAuth,
  user: res.data.user,
  csrf: res.headers['x-csrf-token'],
  authedAt: Date.now()
});

/**
 *  Action creator for cancelling the login process.
 */
export const cancelLogin = () => ({
  type: CANCEL_LOGIN,
})

/**
 *  Function to fetch the returning user authentication from the database.
 *
 *  @param {function} dispatch Redux dispatch function
 *  @returns {function} Dispatches returned action object
 */
const fetchReturning = () => dispatch => {
  dispatch(requestReturning());

  return new Promise((resolve, reject) => {
    const accessToken = Cookies.get(SC_COOKIE);
    if (accessToken) {
      validateToken(accessToken)
        .then(valid => {
          if (valid) {
            dispatch(receiveReturning(valid));

            axios.get('/api/auth/returning', {
              }).then(res => {
                if (res.isAuth === false) {
                  dispatch(cancelReturning());
                }else {
                  dispatch(receiveCSRF(res.headers['x-csrf-token']));
                }
              });
          }else {
            dispatch(errorReturning());
          }
        })
        .catch((err) => {
          dispatch(errorReturning());
        })
    }else {
      dispatch(cancelReturning());
    }
  });
}

export const validateToken = (accessToken) => {
  //TODO:what happens if stemconnect is offline? test it
  return new Promise((resolve, reject) => {
    SteemConnect.setAccessToken(accessToken);
    SteemConnect.me((err, result) => {
      (!err) ? resolve(result) : reject(false);
    })
  });
}

/**
 *  Function to send a logout to the database.
 *
 *  @param {object} state Redux state
 *  @param {function} dispatch Redux dispatch function
 *  @returns {function} Dispatches returned action object
 */
const fetchLogout = (state) => dispatch => {
  const {user} = state.auth;
  dispatch(requestLogout());

  return axios.post('/api/auth/logout', {
      user: user
    }).then(res => {
      dispatch(receiveLogout());
    });
}

/**
 *  Function to send a login to the database.
 *
 *  @param {object} state Redux state
 *  @param {number} expiresAt Date when the token expires
 *  @param {string} accessToken Token string received from Steem Connect
 *  @param {string} user User who is logging in
 *  @param {function} dispatch Redux dispatch function
 *  @returns {function} Dispatches returned action object
 */
const fetchLogin = (expiresAt, accessToken, user) => dispatch => {
  //const user = state.auth.userData.name;
  dispatch(requestLogin(user));

  return axios.post('/api/auth/login', {
      expiresAt: expiresAt,
      accessToken: accessToken,
      user: user
    }).then(res => {
      const accessToken = Cookies.get(SC_COOKIE);
      if (accessToken) {
        validateToken(accessToken)
          .then(valid => {
            if (valid) {
              dispatch(receiveLogin(res));
            }
          })
      }else {
        dispatch(cancelLogin());
      }
    });
}

export const cookieUser = () => {
  return jwt.decode(Cookies.get(SC_COOKIE))['user'];
}

/**
 *  Function to handle call for returning user authentication
 *
 *  @param {function} dispatch Redux dispatch function
 *  @param {function} getState Redux funtion to get the store state
 *  @returns {function} Dispatches returned action object
 */
export const handleReturning = () => (dispatch, getState) => {
  const {isAuth, isAuthorizing} = getState().auth;
  if (!isAuth && !isAuthorizing)
    return dispatch(fetchReturning());
}

/**
 *  Function to handle call for user logout
 *
 *  @param {function} dispatch Redux dispatch function
 *  @param {function} getState Redux funtion to get the store state
 *  @returns {function} Dispatches returned action object
 */
export const handleLogout = () => (dispatch, getState) => {
  return dispatch(fetchLogout(getState()));
}

/**
 *  Function to handle call for user login
 *
 *  @param {number} expiresAt Date when the token expires
 *  @param {string} accessToken Token string received from Steem Connect
 *  @param {string} user User who is logging in
 *  @param {function} dispatch Redux dispatch function
 *  @param {function} getState Redux funtion to get the store state
 *  @returns {function} Dispatches returned action object
 */
export const handleLogin = (expiresAt, accessToken, user) => dispatch => {
  return dispatch(fetchLogin(expiresAt, accessToken, user));
}
