import axios from 'axios';

export const REQUEST_RETURNING = 'REQUEST_RETURNING';
export const RECEIVE_RETURNING = 'RECEIVE_RETURNING';
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export const RECEIVE_LOGOUT = 'RECEIVE_LOGOUT';
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';

export const requestReturning = () => ({
  type: REQUEST_RETURNING
});

export const receiveReturning = (res) => ({
  type: RECEIVE_RETURNING,
  isAuth: res.data.isAuth,
  isAuthorizing: false,
  userData: res.data.user,
  csrf: res.headers['x-csrf-token'],
  authedAt: Date.now()
})

export const requestLogout = () => ({
  type: REQUEST_LOGOUT
});

export const receiveLogout = () => ({
  type: RECEIVE_LOGOUT
});

export const requestLogin = (user) => ({
  type: REQUEST_LOGIN,
  userData: {name: user}
});

export const receiveLogin = (res) => ({
  type: RECEIVE_LOGIN,
  isAuth: res.data.isAuth,
  userData: res.data.user,
  csrf: res.headers['x-csrf-token'],
  authedAt: Date.now()
});

const fetchReturning = () => dispatch => {
  dispatch(requestReturning());

  return axios.get('/auth/returning', {
  }).then(res => {
      dispatch(receiveReturning(res));
    });
}

const fetchLogout = (state) => dispatch => {
  const user = state.auth.userData.name;
  dispatch(requestLogout());

  return axios.post('/auth/logout', {
      user: user
    }).then(res => {
      dispatch(receiveLogout());
    });
}

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

export const handleReturning = () => (dispatch, getState) => {
  return dispatch(fetchReturning());
}

export const handleLogout = () => (dispatch, getState) => {
  return dispatch(fetchLogout(getState()));
}

export const handleLogin = (expiresAt, accessToken, user) => (dispatch, getState) => {
  return dispatch(fetchLogin(getState(), expiresAt, accessToken, user));
}
