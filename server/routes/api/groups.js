import { Router } from 'express';

import {getRecentGroupActivity} from './recentActivity';
//import logger from '../../logger';

const router = new Router();

/**
 *  GET route to get a user's community groups.
 *  Route: /api/groups/user/:name/:type
 *
 *  Gets the local DB object, user name and type of group (owned/joined).
 *  Retrieves the user's groups from the DB and reeturns them.
 */
router.get('/user/:user/:type', (req, res, next) => {
  const db = req.app.locals.db;
  const user = req.params.user;
  const type = req.params.type;


  //Get group data from DB and return
  getUserGroups(db, next, user, type)
    .then(data => {
      res.json({ groups: data })
    })
    .catch(next);
})

/**
 *  Get the Owned or Joined user's groups from DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {function} next Middleware function
 *  @param {string} user Logged in user name
 *  @param {string} type Type of group data to get ['owned'|'joined']
 *  @param {number} [limit] Limit for query return
 *  @returns {object} Group data object to send to frontend
 */
export const getUserGroups = async (db, next, user, type, limit) => {
  if (type === 'owned') {
    const groups = db.collection('kgroups').find({owner: user}).sort( { _id: -1 } ).toArray().then(result => {
      return result;
    }).catch(next);

    return await groups;
  }else {
    //If type is not Owned, then it's Joined Groups to return
    return new Promise((resolve, reject) => {

      let groupAccess = [];
      let order = {_id: -1};
      if (type === 'joined') {
        groupAccess = [{$gt: 0}, {$lt: 100}];
        //order = {created: -1};
      }else {
        groupAccess = [{$gte: 0 }, {$lt: 100}];
        order = limit ? {updated: -1} : {name: 1};
      }
      //Get groups not owned, and whbich user has access to
      db.collection('kgroups_access').aggregate([
        {
          $match : {
            $and: [
              {
                user: user
              }, {
                access: groupAccess[0]
              }, {
                access: groupAccess[1]
              }
            ]
          }
        }, {
          $lookup: {
            from: 'kgroups',
            localField: 'group',
            foreignField: 'name',
            as: 'kgroup'
          }
        },
        /*{ $unwind: '$kgroup' },*/
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                "$$ROOT", {
                  "$arrayElemAt": [
                    "$kgroup",
                    0
                  ]
                }
              ]
            }
          }
        },
        {
          "$project": {
            "kgroup": 0
          }
        },{
          $sort: order
        }, {
          $limit: limit || 20
        }
      ]).toArray((err, result) => {

      err
        ? reject(err)
        : resolve(result);
      })
    }).catch(next);
  }
}

/**
 *  GET route to get groups foro the Communities page.
 *  Route: /api/groups/
 *
 *  Gets the local DB object, group name.
 *  Retrieves the post and user group data for which the user has access.
 */
router.get('/list/:user', async (req, res, next) => {
  const db = req.app.locals.db;
  const { user } = req.params;

  const listlimit = 20;
  const groupLimit = 4;
  const postLimit = 5;

  const groupsCreated = getGroupsCreated(db, next, listlimit);
  const groupsActivity = getRecentGroupActivity(db, next, groupLimit, postLimit, user);

  /*const groupName = getGroupDisplayName(db, group);
  const groupAccess = getGroupAccess(db, group, user)
  const groupPosts = getGroupPosts(db, group);
  const groupUsers = getGroupUsers(db, group);*/

  //
  Promise.all([groupsActivity, groupsCreated]).then((result) => {
    res.json({
      //groupsList,
      groupsActivity: result[0],
      groupsCreated: result[1],

      /*group: {
        name: group,
        display: result[0]['display'],
        access: result[1]['access']
      },
      posts: result[2],
      users: result[3]*/
    })
  }).catch(next)
})

const getGroupsCreated = (db, next, listLimit) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups').find().sort( { updated: -1 } ).limit(listLimit).toArray().then(result => {
      if (result) resolve(result);
      else reject(false);
    })
  }).catch(next)
}

/**
 *  GET route to get posts and users data that belong to a group.
 *  Route: /api/groups/:group/:user
 *
 *  Gets the local DB object, group name.
 *  Retrieves the post and user group data for which the user has access.
 */
router.get('/:group/:user', async (req, res, next) => {
  const db = req.app.locals.db;
  const { group, user } = req.params;

  const groupName = getGroupDisplayName(db, next, group);
  const groupAccess = getGroupAccess(db, next, group, user)
  const groupPosts = getGroupPosts(db, next, group);
  const groupUsers = getGroupUsers(db, next, group);
  const groupPendingUsers = getGroupPendingUsers(db, next, group);

  //Resolve promises for group name, group posts and group users
  //Return data to frontend
  Promise.all([groupName, groupAccess, groupPosts, groupUsers, groupPendingUsers]).then((result) => {
    res.json({
      group: {
        name: group,
        display: result[0]['display'],
        access: result[1]['access']
      },
      posts: result[2],
      users: result[3],
      pending: result[4]
    })
  }).catch(next);
})

/**
 *  Get a group name from DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group Group to get data from
 *  @returns {object} Group name object to send to frontend
 */
const getGroupDisplayName = async (db, next, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups').findOne({name: group}, {projection: {display: 1, _id: 0 }}, (err, result) => {
      if (result) resolve(result);
      else reject(err);
    })
  }).catch(next)
}

/**
 *  Get a user's access level for group
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group Group to get data from
 *  @param {string} user User logged in
 *  @returns {object} Group name object to send to frontend
 */
const getGroupAccess = async (db, next, group, user) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups_access').findOne({group: group, user: user}, {projection: {access: 1, _id: 0 }}, (err, result) => {
      if (result) resolve(result);
      else reject(err);
    })
  }).catch(next)
}

/**
 *  Get a group's posts from DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group Group to get data from
 *  @returns {object} Group's posts data object to send to frontend
 */
const getGroupPosts = async (db, next, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kposts').find({group: group}).sort( { _id: -1 } ).toArray().then(result => {
      if (result) resolve(result);
      else reject(false);
    })
  }).catch(next)
}

/**
 *  Get a group's users from DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group Group to get data from
 *  @returns {object} Group's users data object to send to frontend
 */
const getGroupUsers = async (db, next, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups_access').find({group: group, access: {$lt: 100}}).sort( { user: 1 } ).toArray().then(result => {
      if (result) resolve(result);
      else reject(false);
    })
  }).catch(next)
}

/**
 *  Get a group's pending user approvals from DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group Group to get data from
 *  @returns {object} Group's users data object to send to frontend
 */
const getGroupPendingUsers = async (db, next, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups_access').find({group: group, access: 100}).sort( { user: 1 } ).toArray().then(result => {
      if (result) resolve(result);
      else reject(false);
    })
  }).catch(next)
}




export default router;
