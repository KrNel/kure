import { Router } from 'express';

import csrfValidateRequest from '../auth/csrfValidateRequest';

const router = new Router();

router.post('/add', async (req, res) => {
  const db = req.app.locals.db;

  const { user, newUser, group, access } = req.body;

  const csrfValid = await csrfValidateRequest(req, res, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const userAdd = await addUserToGroup(db, user, newUser, group, access);
    if (userAdd) {
       res.json({user: userAdd});
    }else {
      res.json({user: userAdd});
    }
  }
})

const addUserToGroup = (db, user, newUser, group, access = 3) => {
  try {
    const added = new Date();
    const ObjectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
    const id = ObjectId();

    const userAccess = {
      _id: id,
      group: group,
      user: newUser,
      access: parseInt(access),
      added_on: added,
      added_by: user
    }

    db.collection('kgroups_access').updateOne(
      { user: newUser },
      {
        $set:
          userAccess
      },
      { upsert: true }
    )

    return userAccess;
  }catch (err) {
    throw new Error('Error adding user access group to DB: ', err);
  }
}

router.post('/delete', async (req, res) => {
  const db = req.app.locals.db;
  let { group, user, userToDel } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const userDeleted = await deleteUserFromGroup(db, userToDel, group);
    if (userDeleted) {
      res.json(true);
    }else {
      res.json(false);
    }
  }
})

const deleteUserFromGroup = (db, user, group) => {
  try {
    //delete from kgroups_access collection
    db.collection('kgroups_access').deleteOne(
      { user: user, group: group }
    )

    return true;
  }catch (err) {
    throw new Error('Error deleting post from DB: ', err);
  }
}


export default router;
