import { Router } from 'express';
import csrfValidateRequest from '../auth/csrfValidateRequest';
import verifyAccess from '../../../utils/verifyAccess';

const router = new Router();

/**
 *  POST route to add a new community group.
 *  Route: /manage/groups/add
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  and group to delete from.
 *  CSRF validation is done. If valid, proceed with database query.
 *  Database inserted object will be returned to the frontend.
 */
router.post('/add', async (req, res, next) => {
  const db = req.app.locals.db;

  let { group, user } = req.body;
  group = group.trim();
  const groupClean = group.toLowerCase().replace(/\s/g, '-');
  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Check if group exists
    const exists = await groupExists(db, next, groupClean);
    if (exists) {
       res.json({exists: true});
    }else {
      //Check if user has reached the number of allowed Owned Groups
      const exceeded = await exceededGrouplimit(db, next, user);
      if (exceeded) {
        res.json({exceeded: true});
      }else {
        //Insert the group
        const created = groupUpsert(db, next, group, groupClean, user);
        res.json({
          group: {
            name: groupClean,
            display: group,
            owner: user,
            followers: 0,
            likes: 0,
            created: created,
            updated: created,
            posts: 0,
            rating: 0,
            users: 1,
            joinRequests: 0
          }
        });
      }
    }
  }
})

/**
 *  Query the DB to see if a group already exists.
 *
 *  @param {object} db MongoDB connection
 *  @param {function} next Express middleware
 *  @param {string} group Group to verify
 *  @returns {boolean} Determines if group exists or not
 */
const groupExists = async (db, next, group) => {
  const exists = db.collection('kgroups').find({name: group}, {projection: {name: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(err => {
		next(err);
	});
  return await exists;
}

/**
 *  Query the DB to see if a user has reached their Owned Group limit.
 *
 *  @param {object} db MongoDB connection
 *  @param {function} next Express middleware
 *  @param {string} user User to verify
 *  @returns {boolean} Determines if a user has reached their limit
 */
const exceededGrouplimit = async (db, next, user) => {
  const exceeded = db.collection('users').find({name: user, 'owned_kgroups': {$gte: 4}}, {projection: {name: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(err => {
		next(err);
	});
  return await exceeded;
}

/**
 *  Insert the new group into the DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {function} next Express middleware
 *  @param {string} group New group full display name to insert
 *  @param {string} groupTrim New group trimmed name to insert
 *  @param {string} user Logged in user to insert
 *  @returns {object} The date the group was created at
 */
const groupUpsert = (db, next, group, groupTrim, user) => {
  try {
    const created = new Date();

    //Add group to 'kgroups' DB
    db.collection('kgroups').updateOne(
      { name: groupTrim },
      {
        $set:
        {
          name: groupTrim,
          display: group,
          created: created,
          updated: created,
          owner: user,
          followers: 0,
          likes: 0,
          posts: 0,
          rating: 0,
          users: 1,
          joinRequests: 0
        }
      },
      { upsert: true }
    )

    db.collection('kgroups').createIndex({name: 1});

    //Increment the user's owned group count
    db.collection('users').updateOne(
      { name: user },
      {
        $inc:
        {
          owned_kgroups: 1,
          'groups.curating': 1
        }
      }
    )

    //Create new access entry for user and group
    db.collection('kgroups_access').insertOne(
      {
        group: groupTrim,
        user: user,
        access: 0,
        added_on: created
      }
    )

    db.collection('kgroups_access').createIndex({group: 1, user: 1});

    return created;
  }catch (err) {
    next(err);
  }
}

/**
 *  POST route to add a new community group.
 *  Route: /manage/groups/delete
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  and group to delete.
 *  CSRF validation is done. If valid, proceed with database query.
 *  Database inserted object will be returned to the frontend.
 */
router.post('/delete', async (req, res, next) => {
  const db = req.app.locals.db;
  let { group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Delete group from DB
    const groupDeleted = await verifyAccess(db, next, group, user, 'group', 'del') && await deleteGroup(db, next, group, user);
    res.json(groupDeleted || false);
  }
})

/**
 *  Delete a post from a community group.
 *
 *  @param {object} db MongoDB Connectioon
 *  @param {function} next Express middleware
 *  @param {string} post Post to remove from the group
 *  @param {string} group Group name to remove from
 *  @returns {boolean} Determines if deleting a post was a success
 */
const deleteGroup = (db, next, group, user) => {
  try {
    //Delete group from kgroups collection
    db.collection('kgroups').deleteOne(
      { name: group }
    )

    //Delete all user accesses associated with group
    db.collection('kgroups_access').deleteMany(
      { group: group }
    )

    //Delete all posts associated with group
    db.collection('kposts').deleteMany(
      { group: group }
    )

    //Decrement Owned Group count for user
    db.collection('users').updateOne(
      { name: user },
      {
        $inc:
        {
          owned_kgroups: -1,
          'groups.curating': -1
        }
      }
    )
    return true;
  }catch (err) {
    next(err);
  }
}


/**
 *  POST route to add a join request for a group.
 *  Route: /manage/groups/join
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  and group to join.
 *  CSRF validation is done. If valid, proceed with database query.
 *  Database inserted object will be returned to the frontend.
 */
router.post('/join', async (req, res, next) => {
  const db = req.app.locals.db;
  let { group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Add join request to DB
    const joinRequested = await requestJoinGroup(db, next, group, user);
    res.json(joinRequested || false);
  }
})

/**
 *  Insert the new user join request into the DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {function} next Express middleware
 *  @param {string} group Group name to requset a join in
 *  @param {string} user New user to approve
 *  @returns {object} The date the group was created at
 */
const requestJoinGroup = (db, next, group, user) => {
  try {
    const created = new Date();

    //Create new access entry for user and group
    db.collection('kgroups_access').insertOne(

        {
          group: group,
          user: user,
          access: 100,
          added_on: created,
        }

    )

    //Increment request count in user collection
    db.collection('users').updateOne(
      { name: user },
      {
        $inc:
        {
          'pendingJoinRequests.curating': 1
        }
      }
    )

    //Increment join request count for group
    db.collection('kgroups').updateOne(
      { name: group },
      {
        $inc:
        {
          joinRequests: 1
        }
      }
    )

    return true;
  }catch (err) {
    next(err);
  }
}

export default router;
