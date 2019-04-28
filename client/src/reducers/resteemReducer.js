import {
  RESTEEM_START, RESTEEM_SUCCESS
} from '../actions/resteemActions';

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
