export const SEND_SETTINGS = 'SEND_SETTINGS';

/**
 *  Action creator to set the layout for the grid or list view.
 *
 *  @param {string} posts Data returned from database
 *  @param {object} hasMore If there are more posts to grab
 *  @returns {object} The action data
 */
const setView = showGrid => ({
  type: SEND_SETTINGS,
  showGrid,
});

/**
 *  Function to toggle the view layout setting for the Steem, Blog and Feed
 *  pages. Sets showGrid to the opposite of it's current boolean state.
 *
 *  @returns {function} Dispatches returned action object
 */
export const changeViewSettings = () => (dispatch, getState) => {
  let { showGrid } = getState().settings;

  showGrid = !showGrid;

  setViewStorage(showGrid);

  dispatch(setView(showGrid));
}

/**
 *  Sets the view type into localStorage for the user's future use.
 *
 *  @param {string} user Logged in user
 *  @param {string} view View type (grid, layout, etc)
 */
const setViewStorage = showGrid => {
  localStorage.setItem('showGrid', showGrid);
}

/**
 *  Gets the view type from localStorage.
 *
 *  @param {string} user Logged in user
 */
const getViewStorage = () => (
  localStorage.getItem('showGrid')
)

/**
 *  Gets the inital view type from localStorage on first page load.
 */
export const initViewStorage = () => (dispatch, getState) => {
  const showGrid = JSON.parse(getViewStorage());

  if (showGrid !== null)
    dispatch(setView(showGrid));
}

export default changeViewSettings;
