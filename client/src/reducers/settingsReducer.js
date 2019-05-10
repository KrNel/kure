import {
  SEND_SETTINGS
} from '../actions/settingsActions';

/**
 *  Reducer function for settings that a page will use. Will set settings
 *  on the view for grid or list based on boolean value.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const settings = (state = {
  showGrid: true,
}, action) => {

  switch (action.type) {
    case SEND_SETTINGS:
      return {
        ...state,
        showGrid: action.showGrid,
      }
    default:
      return state
  }
}

export default settings;
