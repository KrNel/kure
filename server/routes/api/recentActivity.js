import { Router } from 'express';

import {getUserGroups} from './groups';

const router = new Router();

/**
 *  GET route to get the recent post activity.
 *  Route: /api/recentposts
 *
 *  Gets the local DB object.
 *  Resteive the recently active posts from the DB.
 */
router.get('/:user/:limit', (req, res, next) => {
  const db = req.app.locals.db;
  const user = req.params.user;
  const limit = parseInt(req.params.limit);

  const myCommsLimit = limit;
  const mySubsLimit = limit;
  const recentPostLimit = 50;
  const groupLimit = 4;
  const postLimit = 5;

  const recentPosts = getRecentPosts(db, next, recentPostLimit);
  const groupsActivity = getRecentGroupActivity(db, next, groupLimit, postLimit, user);
  const myCommunities = getUserGroups(db, next, user, 'all', myCommsLimit);
  const mySubmissions = getMySubmissions(db, next, user, mySubsLimit)

  //Resolve promises
  Promise.all([recentPosts, groupsActivity, myCommunities, mySubmissions]).then((result) => {
    res.json({
      posts: result[0],
      groups: result[1],
      myComms: result[2],
      mySubs: result[3]
    })
  }).catch(next);
})

/**
 *  Get the Owned or Joined user's groups from DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {function} next Middleware function
 *  @returns {object} Recent post data object to send to frontend
 */
const getRecentPosts = async (db, next, limit = 50) => {
  return new Promise((resolve, reject) => {
    db.collection('kposts').aggregate([
      { $lookup: {
        from: 'kgroups',
        as: 'kgroup',
        let: { kpost_group : '$group' },
        pipeline: [
          { $match: {
            $expr: { $eq: [ '$name', '$$kpost_group' ] }
          } }
        ]
      } },
      { $unwind: '$kgroup' },
      { $project: {
          display: '$kgroup.display',
          group: 1,
          likes: 1,
          views: 1,
          rating: 1,
          st_permlink: 1,
          st_author: 1,
          st_category: 1,
          st_title: 1,
      } },
      { $sort: {_id: -1} },
      { $limit : limit }
    ]).toArray((err, result) => {
      err ? reject(err) : resolve(result);
    })
  }).catch(next)
}

/**
 *  Get the recent group activity.
 *  If user logged in, then get a more complex data query of their access
 *  level to the active groups.
 *
 *  @param {object} db MongoDB connection
 *  @param {function} next Middleware function
 *  @returns {object} Recent group activity  data object to send to frontend
 */
export const getRecentGroupActivity = async (db, next, groupLimit, postLimit, user) => {
  return new Promise((resolve, reject) => {
    if (user) {
      db.collection('kgroups').aggregate([

        { $lookup: {
            from: 'kposts',
            as: 'posts',
            let: { kgroups_name : '$name' },
            pipeline: [
              { $match: {
                $expr: { $eq: [ '$group', '$$kgroups_name' ] }
              } },
              { $sort: { _id: -1 } },
              { $limit: postLimit },
            ]
          }
        },
        { $sort: { updated: -1 } },
        { $limit: groupLimit },
        {
          $lookup: {
            from: "kgroups_access",
            as: "access",
            let: { kgroups_name : '$name' },
            pipeline: [
              { $match: {
                  user: user
                ,
                $expr: { $eq: [ '$group', '$$kgroups_name' ] } }
              },
              { $project: {
                _id: 0,
                access: 1
              } }
            ]
           }
        },
        { $unwind: { path: '$access', preserveNullAndEmptyArrays: true }}

      ]).toArray((err, result) => {
        err ? reject(err) : resolve(result);
      })
    }else {
      db.collection('kgroups').aggregate([
        { $lookup: {
          from: 'kposts',
          as: 'posts',
          let: { kgroups_name : '$name' },
          pipeline: [
            { $match: {
              $expr: { $eq: [ '$group', '$$kgroups_name' ] }
            } },
            { $sort: { _id: -1 } },
            { $limit: postLimit }
          ]
        } },
        { $sort: { updated: -1 } },
        { $limit: groupLimit }
      ]).toArray((err, result) => {
        err ? reject(err) : resolve(result);
      })
    }
  }).catch(next)
}

/**
 *  Get the recent submissions for curation a user has made.
 *
 *  @param {object} db MongoDB connection
 *  @param {function} next Middleware function
 *  @param {string} user Logged in user name
 *  @param {number} limit Limit for query return
 *  @returns {object} Recent group activity  data object to send to frontend
 */
const getMySubmissions = (db, next, user, limit) => {
  return new Promise((resolve, reject) => {
    db.collection('kposts').find({added_by: user}).sort( { _id: -1 } ).limit(limit).toArray((err, result) => {
      err ? reject(err) : resolve(result);
    })
  }).catch(next)
}

export default router;