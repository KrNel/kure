import {
  RESTEEM_START, RESTEEM_SUCCESS
} from '../actions/resteemActions';

/**
 *  Reducer function for resteem Redux state data. Determines which post
 *  has been resteemed and keeps a record of them all in state object.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const resteem = (state = {
  resteemedPayload: {
    resteeming: 0,
    pids: [],
  },
}, action) => {

  switch (action.type) {
    case RESTEEM_START:
      return {
        ...state,
        resteemedPayload: {
          ...state.resteemedPayload,
          resteeming: action.pid,
        }
      }
    case RESTEEM_SUCCESS: {
      return {
        ...state,
        resteemedPayload: {
          ...state.resteemedPayload,
          pids: [
            ...state.resteemedPayload.pids,
            action.pid
          ],
          resteeming: 0,
        }
      }
    }
    default:
      return state
  }
}

export default resteem;
