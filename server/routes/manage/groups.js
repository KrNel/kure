import { Router } from 'express';
import csrfValidateRequest from '../auth/csrfValidateRequest';
import verifyAccess from '../../utils/verifyAccess';

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
router.post('/add', async (req, res) => {
  const db = req.app.locals.db;

  let { group, user } = req.body;
  group = group.trim();
  const groupClean = group.toLowerCase().replace(/\s/g, '-');
  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Check if group exists
    const exists = await groupExists(db, groupClean);
    if (exists) {
       res.json({exists: true});
    }else {
      //Check if user has reached the number of allowed Owned Groups
      const exceeded = await exceededGrouplimit(db, user);
      if (exceeded) {
        res.json({exceeded: true});
      }else {
        //Insert the group
        const created = groupUpsert(db, group, groupClean, user);
        res.json({
          group: {
            name: groupClean,
            display: group,
            owner: user,
            followers: 1,
            likes: 1,
            created: created,
            posts: 0
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
 *  @param {string} group Group to verify
 *  @returns {boolean} Determines if group exists or not
 */
const groupExists = async (db, group) => {
  const exists = db.collection('kgroups').find({name: group}, {projection: {name: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(err => {
		throw new Error('Error adding group to DB: ', err);
	});
  return await exists;
}

/**
 *  Query the DB to see if a user has reached their Owned Group limit.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} user User to verify
 *  @returns {boolean} Determines if a user has reached their limit
 */
const exceededGrouplimit = async (db, user) => {
  const exceeded = db.collection('users').find({name: user, 'owned_kgroups': {$gte: 4}}, {projection: {name: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(err => {
		throw new Error('Error verifying group exists in DB: ', err);
	});
  return await exceeded;
}

/**
 *  Insert the new group into the DB.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group New group full display name to insert
 *  @param {string} groupTrim New group trimmed name to insert
 *  @param {string} user Logged in user to insert
 *  @returns {object} The date the group was created at
 */
const groupUpsert = (db, group, groupTrim, user) => {
  try {
    //Add group to 'kgroups' DB
    const created = new Date();
    db.collection('kgroups').updateOne(
      { name: groupTrim },
      {
        $set:
        {
          name: groupTrim,
          display: group,
          created: created,
          owner: user,
          followers: 1,
          likes: 1,
          posts: 0,
          rating: 0
        }
      },
      { upsert: true }
    )

    //Increment the user's owned group count
    db.collection('users').updateOne(
      { name: user },
      {
        $inc:
        {
          owned_kgroups: 1
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

    return created;
  }catch (err) {
    throw new Error('Error inserting gruop to DB: ', err);
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
router.post('/delete', async (req, res) => {
  const db = req.app.locals.db;
  let { group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Delete group from DB
    const groupDeleted = await verifyAccess(db, group, user, 'group', 'del') && await deleteGroup(db, group, user);
    res.json(groupDeleted || false);
  }
})

/**
 *  Delete a post from a community group.
 *
 *  @param {object} db MongoDB Connectioon
 *  @param {string} post Post to remove from the group
 *  @param {string} group Group name to remove from
 *  @returns {boolean} Determines if deleting a post was a success
 */
const deleteGroup = (db, group, user) => {
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
          owned_kgroups: -1
        }
      }
    )
    return true;
  }catch (err) {
    throw new Error('Error deleting group from DB: ', err);
  }
}

export default router;
