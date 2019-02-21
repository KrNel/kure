import axios from 'axios';

/**
 *  Get the groups a user is assocaited with.
 *
 *  @param {string} user User to get groups for
 *  @param {string} type Type of group, 'owned', 'joined' or 'all'
 */
export const getUserGroups = (user, type) => {
  return getData(`/api/groups/user/${user}/${type}`);
}

/**
 *  Get the group to manage.
 *
 *  @param {string} group Requested group
 *  @param {string} user User to get groups for
 */
export const getManageGroup = (group, user) => {
  return getData(`/api/groups/${group}/${user}`);
}

/**
 *  Get the recent posts and community activity on the site, and the
 *  recent group activity and submittions a user is assocaited with.
 *
 *  @param {string} user User to get groups for
 *  @param {string} limit Limit of records to return
 */
export const getRecentActivity = (user, limit = 10) => {
  return getData(`/api/recentactivity/${user}/${limit}`);
}

/**
 *  Get the list of communities on the site. Most recently created first.
 *
 *  @param {string} limit Limit of records to return
 */
export const getGroupsPage = (user, listLimit = 20) => {
  return getData(`/api/groups/list/${listLimit}/${user}`);
}

/**
 *  Axios fecther for the GET calls.
 *
 *  @param {string} path Server path to get data
 */
const getData = (path) => {
  return axios.get(path);
}

/**
 *  Call/fetch to add a group.
 *
 *  @param {object} params Data to pass to server fetch
 *  @param {string} csrf CSRF token
 */
export const addGroup = (params, csrf) => {
  return postData('/manage/groups/add', params, csrf);
}

/**
 *  Call/fetch to delete a group.
 *
 *  @param {object} params Data to pass to server fetch
 *  @param {string} csrf CSRF token
 */
export const deleteGroup = (params, csrf) => {
  return postData('/manage/groups/delete', params, csrf);
}

/**
 *  Call/fetch to add a post.
 *
 *  @param {object} params Data to pass to server fetch
 *  @param {string} csrf CSRF token
 */
export const addPost = (params, csrf) => {
  return postData('/manage/posts/add', params, csrf);
}

/**
 *  Call/fetch to delete a post.
 *
 *  @param {object} params Data to pass to server fetch
 *  @param {string} csrf CSRF token
 */
export const deletePost = (params, csrf) => {
  return postData('/manage/posts/delete', params, csrf);
}

/**
 *  Call/fetch to add a user.
 *
 *  @param {object} params Data to pass to server fetch
 *  @param {string} csrf CSRF token
 */
export const addUser = (params, csrf) => {
  return postData('/manage/users/add', params, csrf);
}

/**
 *  Call/fetch to delete a user.
 *
 *  @param {object} params Data to pass to server fetch
 *  @param {string} csrf CSRF token
 */
export const deleteUser = (params, csrf) => {
  return postData('/manage/users/delete', params, csrf);
}

export const requestToJoinGroup = (params, csrf) => {
  return postData('/manage/groups/join', params, csrf);
}

export const approveUser = (params, csrf) => {
  return postData('/manage/users/approve', params, csrf);
}

export const denyUser = (params, csrf) => {
  return postData('/manage/users/deny', params, csrf);
}

/**
 *  Call/fetch for logging.
 *
 *  @param {object} params Data to pass to server fetch
 */
export const logger = (type, msg) => {
  const params = (type === 'error')
    ? ({
        level: 'error',
        message: {
          name: msg.name,
          message: msg.message,
          stack: msg.stack
        }
      })
    : ({
        level: 'info',
        message: msg
      });
  return postData('/logger', params);
}

/**
 *  Axios fecther for the POST calls.
 *
 *  @param {string} path Server path to get data
 *  @param {object} params Data to pass to server fetch
 *  @param {string} csrf CSRF token
 */
const postData = (path, params, csrf) => {
  return axios.post(path, params, {
    headers: {
      "x-csrf-token": csrf
    }
  });
}

export default addGroup;
