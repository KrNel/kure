import {
  REQUEST_RETURNING,
  RECEIVE_RETURNING,
  CANCEL_RETURNING,
  ERROR_RETURNING,
  REQUEST_LOGOUT,
  RECEIVE_LOGOUT,
  REQUEST_LOGIN,
  RECEIVE_LOGIN,
  RECEIVE_CSRF,
} from '../actions/authActions';

/**
 *  Reducer function for authentication data for logins or returning users.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const auth = (
  state = {
    isAuth: false,
    isAuthorizing: false,
    csrf: '',
    user: '',
  },
  action) => {

  switch (action.type) {
    case REQUEST_RETURNING:
      return ({
        ...state,
        isAuthorizing: true,
      });
    case ERROR_RETURNING:
    case RECEIVE_RETURNING:
      return ({
        ...state,
        isAuth: action.isAuth,
        isAuthorizing: action.isAuthorizing,
        user: action.user,
        csrf: action.csrf || '',
        lastUpdated: action.authedAt
      });
    case RECEIVE_CSRF:
      return ({
        ...state,
        csrf: action.csrf,
      });
    case CANCEL_RETURNING:
      return ({
        ...state,
        isAuthorizing: false,
        isAuth: false,
        csrf: '',
        user: '',
      });
    case REQUEST_LOGIN: {
      return ({
        ...state,
        isAuthorizing: true,
      });
    }
    case RECEIVE_LOGIN: {
      return ({
        ...state,
        isAuth: action.isAuth,
        isAuthorizing: false,
        user: action.user,
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
        user: '',
      });
    default:
      return state;
  }
}

export default auth;
