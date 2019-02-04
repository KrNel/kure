import axios from 'axios';

export const REQUEST_RETURNING = 'REQUEST_RETURNING';
export const RECEIVE_RETURNING = 'RECEIVE_RETURNING';
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export const RECEIVE_LOGOUT = 'RECEIVE_LOGOUT';
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';

/**
 *  Action creator for requesting returning user athentication.
 *
 *  @return {object} - The action data
 */
export const requestReturning = () => ({
  type: REQUEST_RETURNING
});

/**
 *  Action creator for requesting returning user athentication.
 *
 *  @param {object} res - Results of the database fetch
 *  @return {object} - The action data
 */
export const receiveReturning = (res) => ({
  type: RECEIVE_RETURNING,
  isAuth: res.data.isAuth,
  isAuthorizing: false,
  userData: res.data.user,
  csrf: res.headers['x-csrf-token'],
  authedAt: Date.now()
})

/**
 *  Action creator for requesting a logout.
 *
 *  @returns {object} - The action data
 */
export const requestLogout = () => ({
  type: REQUEST_LOGOUT
});

/**
 *  Action creator for receiving a logout from the database.
 *
 *  @returns {object} - The action data
 */
export const receiveLogout = () => ({
  type: RECEIVE_LOGOUT
});

/**
 *  Action creator for requesting a login.
 *
 *  @returns {object} - The action data
 */
export const requestLogin = (user) => ({
  type: REQUEST_LOGIN,
  userData: {name: user}
});

/**
 *  Action creator for receiving user login from database.
 *
 *  @param {object} res - Results of the database fetch
 *  @returns {object} - The action data
 */
export const receiveLogin = (res) => ({
  type: RECEIVE_LOGIN,
  isAuth: res.data.isAuth,
  userData: res.data.user,
  csrf: res.headers['x-csrf-token'],
  authedAt: Date.now()
});

/**
 *  Function to fetch the returning user authentication from the database.
 *
 *  @param {function} dispatch - Redux dispatch function
 *  @returns {function} - Dispatches returned action object
 */
const fetchReturning = () => dispatch => {
  dispatch(requestReturning());

  return axios.get('/auth/returning', {
  }).then(res => {
      dispatch(receiveReturning(res));
    });
}

/**
 *  Function to send a logout to the database.
 *
 *  @param {object} state - Redux state
 *  @param {function} dispatch - Redux dispatch function
 *  @returns {function} - Dispatches returned action object
 */
const fetchLogout = (state) => dispatch => {
  const user = state.auth.userData.name;
  dispatch(requestLogout());

  return axios.post('/auth/logout', {
      user: user
    }).then(res => {
      dispatch(receiveLogout());
    });
}

/**
 *  Function to send a login to the database.
 *
 *  @param {object} state - Redux state
 *  @param {number} expiresAt - Date when the token expires
 *  @param {string} accessToken - Token string received from Steem Connect
 *  @param {string} user - User who is logging in
 *  @param {function} dispatch - Redux dispatch function
 *  @returns {function} - Dispatches returned action object
 */
const fetchLogin = (state, expiresAt, accessToken, user) => dispatch => {
  const user = state.auth.userData.name;
  dispatch(requestLogin(user));

  return axios.post('/auth/validate', {
      expiresAt: expiresAt,
      accessToken: accessToken,
      user: user
    }).then(res => {
      dispatch(receiveLogin(res));
    });
}

/**
 *  Function to handle call for returning user authentication
 *
 *  @param {function} dispatch - Redux dispatch function
 *  @param {function} getState - Redux funtion to get the store state
 *  @returns {function} - Dispatches returned action object
 */
export const handleReturning = () => (dispatch, getState) => {
  return dispatch(fetchReturning());
}

/**
 *  Function to handle call for user logout
 *
 *  @param {function} dispatch - Redux dispatch function
 *  @param {function} getState - Redux funtion to get the store state
 *  @returns {function} - Dispatches returned action object
 */
export const handleLogout = () => (dispatch, getState) => {
  return dispatch(fetchLogout(getState()));
}

/**
 *  Function to handle call for user login
 *
 *  @param {number} expiresAt - Date when the token expires
 *  @param {string} accessToken - Token string received from Steem Connect
 *  @param {string} user - User who is logging in
 *  @param {function} dispatch - Redux dispatch function
 *  @param {function} getState - Redux funtion to get the store state
 *  @returns {function} - Dispatches returned action object
 */
export const handleLogin = (expiresAt, accessToken, user) => (dispatch, getState) => {
  return dispatch(fetchLogin(getState(), expiresAt, accessToken, user));
}
