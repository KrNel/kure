import axios from 'axios';

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_SECTION = 'SELECT_SECTION'
export const INVALIDATE_SECTION = 'INVALIDATE_SECTION'

export const selectSection = section => ({
  type: SELECT_SECTION,
  section
})

export const invalidateSection = section => ({
  type: INVALIDATE_SECTION,
  section
})

export const requestPosts = section => ({
  type: REQUEST_POSTS,
  section
})

export const receivePosts = (section, data) => ({
  type: RECEIVE_POSTS,
  section,
  posts: data.posts.map(post => post),
  receivedAt: Date.now()
})

const fetchPosts = section => dispatch => {
  dispatch(requestPosts(section))
  return axios.get('/api/recentposts')
    .then(data => {
      dispatch(receivePosts(section, data.data))
    });
}

const shouldFetchPosts = (state, section) => {
  const posts = state.recentActivity[section]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = section => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), section)) {
    return dispatch(fetchPosts(section))
  }
}
