import {
  REQUEST_RETURNING,
  RECEIVE_RETURNING,
  REQUEST_LOGOUT,
  RECEIVE_LOGOUT,
  REQUEST_LOGIN,
  RECEIVE_LOGIN
} from '../actions/authActions';

export const auth = (
  state = {
    isAuth: false,
    isAuthorizing: true,
    csrf: '',
    userData: { name: '' }
  },
  action) => {

  switch (action.type) {
    case REQUEST_RETURNING:
      return ({
        ...state,
        isAuthorizing: true,
      });
    case RECEIVE_RETURNING:
      return ({
        ...state,
        isAuth: action.isAuth,
        isAuthorizing: action.isAuthorizing,
        userData: action.userData,
        csrf: action.csrf || '',
        lastUpdated: action.authedAt
      });
    case REQUEST_LOGIN: {
      return state;
    }
    case RECEIVE_LOGIN: {
      return ({
        ...state,
        isAuth: action.isAuth,
        isAuthorizing: false,
        userData: action.userData,
        csrf: action.csrf,
        lastUpdated: action.authedAt
      });
    }
    case REQUEST_LOGOUT:
      return state;
    case RECEIVE_LOGOUT:
      return ({
        ...state,
        isAuth: false,
        userData: { name: '' }
      });
    default:
      return state;
  }
}

export default auth;
