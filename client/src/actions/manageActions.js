import axios from 'axios';

export const SELECT_GROUP = 'SELECT_GROUP';
export const ADD_GROUP = 'ADD_GROUP';
export const MANAGE_GROUP = 'MANAGE_GROUP';
export const DELETE_GROUP = 'DELETE_GROUP';
export const ADD_POST = 'ADD_POST';
export const DELETE_POST = 'DELETE_POST';

export const selectGroupToManage = group => ({
  type: SELECT_GROUP,
  group
})
/*
export const requestLogin = (user) => ({
  type: REQUEST_LOGIN,
  userData: {name: user}
});

export const receiveLogin = (res) => ({
  type: RECEIVE_LOGIN,
  isAuth: res.data.isAuth,
  userData: {name: res.data.user},
  csrf: res.headers['x-csrf-token'],
  authedAt: Date.now()
});

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
}*/
