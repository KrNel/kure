import axios from 'axios';

export const REQUEST_RECENT_POSTS = 'REQUEST_RECENT_POSTS';
export const RECEIVE_RECENT_POSTS = 'RECEIVE_RECENT_POSTS';
export const INVALIDATE_RECENT_POSTS = 'INVALIDATE_RECENT_POSTS';

export const requestRecentPosts = () => ({
  type: REQUEST_RECENT_POSTS
})

export const receiveRecentPosts = (data) => ({
  type: RECEIVE_RECENT_POSTS,
  posts: data.posts.map(post => post),
  receivedAt: Date.now()
})

export const invalidateRecentPosts = () => ({
  type: INVALIDATE_RECENT_POSTS
})

const fetchRecentPosts = () => dispatch => {
  dispatch(requestRecentPosts());
  return axios.get('/api/recentposts')
    .then(data => {
console.log('fetchRecentPosts: ', data)
      dispatch(receiveRecentPosts(data.data))
    });
  /*.then(data => {

    /*const posts = data.data.posts
    if (posts.length) {
      this.setState({
        isLoading: false,
        recentlyAdded: data.data.posts
      })
    }else {
      this.setState({
        isLoading: false,
        recentlyAdded: [{st_title: ''}]
      })
    }*/
  /*}).catch(err => {
    if (axios.isCancel(err)) {
      console.log('Error: ', err.message);
    } else {
      //this.setState({ isLoading: false });
      console.error(err);
    }
  })*/



}

const shouldFetchRecentPosts = (state) => {
console.log('s0: ', state)
  const posts = state.recentPosts;
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }
  return posts.didInvalidate;
}

export const fetchRecentPostsIfNeeded = () => (dispatch, getState) => {
  if (shouldFetchRecentPosts(getState())) {
    return dispatch(fetchRecentPosts());
  }
}
