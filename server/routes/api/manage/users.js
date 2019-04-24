import { Router } from 'express';
import { verifyAccess } from '../../../utils/verifyAccess';

const router = new Router();

/**
 *  POST route to add a user and give access to a community group.
 *  Route: /manage/users/add
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  new user to add, group to add to, and access to set.
 *  CSRF validation is done. If valid, proceed with database query.
 *  Databse inserted object will be returned to the frontend.
 */
router.post('/add', async (req, res, next) => {
  const db = req.app.locals.db;
  const { user, newUser, group, access } = req.body;

  //Insert user in DB
  const exists = await userExists(db, next, newUser, group);
  if (exists) {
     res.json({exists: true});
  }else {
    const userAdd = await verifyAccess(db, next, group, user, 'user', 'add') && await addUserToGroup(db, next, user, newUser, group, access);
    if (userAdd) {
       res.json({user: userAdd});
    }else {
      res.json({user: userAdd});
    }
  }
})

/**
 *  Query the DB to see if a user already exists in the specific group.
 *
 *  @param {object} db MongoDB connection
 *  @param {function} next Express middleware
 *  @param {string} newUser New user to give access to the group
 *  @param {string} group Group to verify if user exists in
 *  @returns {boolean} Determines if user exists or not
 */
const userExists = async (db, next, newUser, group) => {
  const exists = db.collection('kgroups_access').find({user: newUser, group: group}, {projection: {_id: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(err => {
		next(err)
	});
  return await exists;
}

/**
 *  Add a user to give access to a community group.
 *
 *  userAccess object created from supplied data, then inserted
 *  to the 'kgroups_access' collection.
 *
 *  @param {object} db MongoDB Connection
 *  @param {function} next Express middleware
 *  @param {string} user User currently logged in
 *  @param {string} newUser New user to give access to the group
 *  @param {string} group Group name to add to
 *  @param {number} access Access role level for added user
 *  @returns {object} Send inserted object back to frontend for use
 */
const addUserToGroup = async (db, next, user, newUser, group, access = 3) => {
  try {
    const date = new Date();
    const userAccess = {
      group: group,
      user: newUser,
      access: parseInt(access),
      added_on: date,
      added_by: user
    }

    return new Promise((resolve, reject) => {
      db.collection('kgroups_access').insertOne(userAccess, (err, res) => {
        if(err) {
          reject('Error addUserToGroup DB: ', err);
        } else {

          db.collection('kgroups').updateOne(
            { name: group },
            {
              $inc:
              {
                users: 1
              }
            }
          )
          resolve(res.ops[0]);
       }
      })
    })
  }catch (err) {
    next(err);
  }
}

/**
 *  POST route to delete a user's access to a community group.
 *  Route: /manage/users/delete
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  user to remove, and group to add to.
 *  CSRF validation is done. If valid, proceed with database query.
 *  Databse delete will be true or false, return response to frontend.
 */
router.post('/delete', async (req, res, next) => {
  const db = req.app.locals.db;
  const { group, user, userToDel } = req.body;

  //Delete user from DB
  const userDeleted = await verifyAccess(db, next, group, user, 'user', 'del') && await deleteUserFromGroup(db, next, userToDel, group);
  if (userDeleted) {
    res.json(true);
  }else {
    res.json(false);
  }
})

/**
 *  Delete a user's access to a community group.
 *
 *  @param {object} db MongoDB Connection
 *  @param {function} next Express middleware
 *  @param {string} user User to remove access to the group
 *  @param {string} group Group name to remove from
 *  @returns {boolean} Determines if deleting a user was a success
 */
const deleteUserFromGroup = (db, next, user, group) => {
  try {
    db.collection('kgroups_access').deleteOne(
      { user: user, group: group }
    )

    db.collection('kgroups').updateOne(
      { name: group },
      {
        $inc:
        {
          users: -1
        }
      }
    )
    return true;
  }catch (err) {
    next(err);
  }
}


/**
 *  POST route to approve a user's access to a community group.
 *  Route: /manage/users/approve
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  user to approve, and group.
 *  CSRF validation is done. If valid, proceed with database query.
 *  Databse approve will return object of new user, return response to frontend.
 */
router.post('/approve', async (req, res, next) => {
  const db = req.app.locals.db;
  let { group, newUser, user } = req.body;

  const access = await verifyAccess(db, next, group, user, 'pending', 'add');
  if (access) {
    const approved = await approvalJoinGroup(db, next, group, newUser, user);
    res.json({newUser: approved});
  }
})

/**
 *  Approve a user's access to a community group.
 *
 *  @param {object} db MongoDB Connection
 *  @param {function} next Express middleware
 *  @param {string} group Group name to approve from
 *  @param {string} newUser User to approve access to
 *  @param {string} user User that's doing the approving
 *  @returns {object} The newUser data object
 */
const approvalJoinGroup = (db, next, group, newUser, approver) => {
  try {
    const created = new Date();
    const approved = {
      group,
      user: newUser,
      access: 3,
      added_on: created,
      added_by: approver
    }

    //Create new access entry for user and group
    db.collection('kgroups_access').updateOne(
      { group: group, user: newUser },
      {
        $set: {
          access: 3,
          added_on: created,
          added_by: approver
        }
      },
      { upsert: true }
    )

    //Increment request count in user collection
    db.collection('users').updateOne(
      { name: newUser },
      {
        $inc:
        {
          'pendingJoinRequests.curating': -1
        }
      }
    )

    //Increment join request count for group
    db.collection('kgroups').updateOne(
      { name: group },
      {
        $inc:
        {
          joinRequests: -1,
          users: 1
        }
      }
    )

    return approved;
  }catch (err) {
    next(err);
  }
}

/**
 *  POST route to deny/rejct a user's access to a community group.
 *  Route: /manage/users/deny
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  user to approve, and group.
 *  CSRF validation is done. If valid, proceed with database query.
 *  Databse deny will return true/false, return response to frontend.
 */
router.post('/deny', async (req, res, next) => {
  const db = req.app.locals.db;
  let { group, newUser, user } = req.body;

  //Delete group from DB
  const denied = await verifyAccess(db, next, group, user, 'pending', 'del') && await denyJoinGroup(db, next, group, newUser);
  res.json(denied || false);
})

/**
 *  Deny a user's access to a community group.
 *
 *  @param {object} db MongoDB Connection
 *  @param {function} next Express middleware
 *  @param {string} group Group name to approve from
 *  @param {string} newUser User to approve access to
 *  @returns {boolean} Determines if denying a user was a success
 */
const denyJoinGroup = (db, next, group, newUser) => {
  try {
    //Create new access entry for user and group
    db.collection('kgroups_access').deleteOne(
      { group: group, user: newUser }
    )

    //Increment request count in user collection
    db.collection('users').updateOne(
      { name: newUser },
      {
        $inc:
        {
          'pendingJoinRequests.curating': -1
        }
      }
    )

    //Increment join request count for group
    db.collection('kgroups').updateOne(
      { name: group },
      {
        $inc:
        {
          joinRequests: -1
        }
      }
    )
    return true;
  }catch (err) {
    next(err);
  }
}

/**
 *  POST route to change the owner of a community group.
 *  Route: /manage/users/ownership
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  user to change ownership to, and group.
 *  Access for user is verified, and then ownership is changed.
 */
router.post('/ownership', async (req, res, next) => {
  const db = req.app.locals.db;
  const { group, newOwner, user } = req.body;

  //Modify owner of group in DB
  const changedOwnership = await verifyAccess(db, next, group, user, 'ownership', 'modify') && await changeOwnership(db, next, group, newOwner, user);
  res.json(changedOwnership || false);
})


/**
 *  Modify the ownership of a community group.
 *
 *  Update the collections that have releveant data for managing the
 *  community group data. This is the groups (kgroups), access (kgroups_access)
 *  and users collections.
 *
 *  @param {object} db MongoDB Connection
 *  @param {function} next Express middleware
 *  @param {string} group Group name to add to
 *  @param {string} newOwner New owner to give ownership to
 *  @returns {object} Send inserted object back to frontend for use
 */
const changeOwnership = async (db, next, group, newOwner, user) => {
  try {
    return new Promise((resolve) => {
      db.collection('kgroups').updateOne(
        { name: group },
        {
          $set:
          {
            owner: newOwner
          }
        }
      )

      db.collection('kgroups_access').updateOne(
        { group: group, user: newOwner },
        {
          $set: {
            access: 0,
          }
        }
      )

      db.collection('kgroups_access').updateOne(
        { group: group, user: user },
        {
          $set: {
            access: 3,
          }
        }
      )

      db.collection('users').updateOne(
        { user: newOwner },
        {
          $inc:
          {
            owned_kgroups: 1
          }
        }
      )

      db.collection('users').updateOne(
        { user: user },
        {
          $inc:
          {
            owned_kgroups: -1
          }
        }
      )

      resolve(true);
    })
  }catch (err) {
    next(err);
  }
}


export default router;
