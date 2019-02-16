import { Router } from 'express';

const router = new Router();

/**
 *  GET route to get the recent post activity.
 *  Route: /api/recentposts
 *
 *  Gets the local DB object.
 *  Resteive the recently active posts from the DB.
 */
router.get('/', (req, res, next) => {
  const db = req.app.locals.db;

  const recentPosts = getRecentPosts(db);
  const groupsActivity = getRecentGroupActivity(db);
  //const groupAccess = getGroupAccess(db, group, user)
  //const groupPosts = getGroupPosts(db, group);

  //Resolve promises for group name, group posts and group users
  //Return data to frontend
  Promise.all([recentPosts, groupsActivity]).then((result) => {
    res.json({
      posts: result[0],
      groups: result[1],
      /*users: result[2]*/
    })
  })

  //res.json({posts: result});

})

const getRecentPosts = async (db) => {
  const limit = 50;
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
  })
}

const getRecentGroupActivity = async (db) => {
  const groupLimit = 4;
  const postLimit = 5;
  return new Promise((resolve, reject) => {
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
  })
}


export default router;
