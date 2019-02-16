import { Router } from 'express';

//import logger from '../../logger';

const router = new Router();

/**
 *  GET route to get a user's community groups.
 *  Route: /api/groups/user/:name/:type
 *
 *  Gets the local DB object, user name and type of group (owned/joined).
 *  Retrieves the user's groups from the DB and reeturns them.
 */
router.get('/user/:name/:type', (req, res, next) => {
  const db = req.app.locals.db;
  const user = req.params.name;
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

      let groupAccess = {};
      let order = {_id: -1};
      if (type === 'joined') {
        groupAccess = {$gt: 0};
        //order = {created: -1};
      }else {
        groupAccess = {$gte: 0};
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
                access: groupAccess
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
        { $unwind: '$kgroup' },
        {
          $project: {
            name: '$kgroup.name',
            display: '$kgroup.display',
            created: '$kgroup.created',
            owner: '$kgroup.owner',
            followers: '$kgroup.followers',
            like: '$kgroup.like',
            posts: '$kgroup.posts',
            rating: '$kgroup.rating',
            updated: '$kgroup.updated',
            access: 1,
            added_on: 1
          }
        }, {
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
 *  GET route to get posts and users data that belong to a group.
 *  Route: /api/groups/:group/:user
 *
 *  Gets the local DB object, group name.
 *  Retrieves the post and user group data for which the user has access.
 */
router.get('/:group/:user', async (req, res) => {
  const db = req.app.locals.db;
  const { group, user } = req.params;

  const groupName = getGroupDisplayName(db, group);
  const groupAccess = getGroupAccess(db, group, user)
  const groupPosts = getGroupPosts(db, group);
  const groupUsers = getGroupUsers(db, group);

  //Resolve promises for group name, group posts and group users
  //Return data to frontend
  Promise.all([groupName, groupAccess, groupPosts, groupUsers]).then((result) => {
    res.json({
      group: {
        name: group,
        display: result[0]['display'],
        access: result[1]['access']
      },
      posts: result[2],
      users: result[3]
    })
  })
})

/**
 *  Get a group name from DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group Group to get data from
 *  @returns {object} Group name object to send to frontend
 */
const getGroupDisplayName = async (db, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups').findOne({name: group}, {projection: {display: 1, _id: 0 }}, (err, result) => {
      if (result) resolve(result);
      else reject(false);
    })
  })
}

/**
 *  Get a user's access level for group
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group Group to get data from
 *  @param {string} user User logged in
 *  @returns {object} Group name object to send to frontend
 */
const getGroupAccess = async (db, group, user) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups_access').findOne({group: group, user: user}, {projection: {access: 1, _id: 0 }}, (err, result) => {
      if (result) resolve(result);
      else reject();
    })
  })
}

/**
 *  Get a group's posts from DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group Group to get data from
 *  @returns {object} Group's posts data object to send to frontend
 */
const getGroupPosts = async (db, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kposts').find({group: group}).sort( { _id: -1 } ).toArray().then(result => {
      if (result) resolve(result);
      else reject();
    })
  })
}

/**
 *  Get a group's users from DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group Group to get data from
 *  @returns {object} Group's users data object to send to frontend
 */
const getGroupUsers = async (db, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups_access').find({group: group}).sort( { user: 1 } ).toArray().then(result => {
      if (result) resolve(result);
      else reject();
    })
  })
}

export default router;
