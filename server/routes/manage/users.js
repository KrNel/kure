import { Router } from 'express';
import csrfValidateRequest from '../auth/csrfValidateRequest';

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
router.post('/add', async (req, res) => {
  const db = req.app.locals.db;
  const { user, newUser, group, access } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Insert user in DB
    const userAdd = await addUserToGroup(db, user, newUser, group, access);
    if (userAdd) {
       res.json({user: userAdd});
    }else {
      res.json({user: userAdd});
    }
  }
})

/**
 *  Add a user to give access to a community group.
 *
 *  userAccess object created from supplied data, then inserted
 *  to the 'kgroups_access' collection.
 *
 *  @param {object} db MongoDB Connectioon
 *  @param {string} user User currently logged in
 *  @param {string} newUser New user to give access to the group
 *  @param {string} group Group name to add to
 *  @param {number} access Access role level for added user
 *  @returns {object} Send inserted object back to frontend for use
 */
const addUserToGroup = async (db, user, newUser, group, access = 3) => {
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
         resolve(res.ops[0]);
       }
      })
    })
  }catch (err) {
    throw new Error('Error adding user access group to DB: ', err);
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
router.post('/delete', async (req, res) => {
  const db = req.app.locals.db;
  const { group, user, userToDel } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Delete user from DB
    const userDeleted = await deleteUserFromGroup(db, userToDel, group);
    if (userDeleted) {
      res.json(true);
    }else {
      res.json(false);
    }
  }
})

/**
 *  Delete a user's access to a community group.
 *
 *  @param {object} db MongoDB Connectioon
 *  @param {string} user User to remove access to the group
 *  @param {string} group Group name to remove from
 *  @returns {boolean} Determines if deleting a user was a success
 */
const deleteUserFromGroup = (db, user, group) => {
  try {
    db.collection('kgroups_access').deleteOne(
      { user: user, group: group }
    )
    return true;
  }catch (err) {
    throw new Error('Error deleting post from DB: ', err);
  }
}

export default router;
