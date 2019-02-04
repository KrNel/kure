import { Router } from 'express';

import csrfValidateRequest from '../auth/csrfValidateRequest';

const router = new Router();

//const initialState = serialize(response);
//var html = xss('<script>alert("xss");</script>');
router.post('/add', async (req, res) => {
  const db = req.app.locals.db;

  let { group, user } = req.body;
  group = group.trim();
  const groupClean = group.toLowerCase().replace(/\s/g, '-');

  const csrfValid = await csrfValidateRequest(req, res, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const exists = await groupExists(db, groupClean);
    if (exists) {
       res.json({exists: true});
    }else {
      const exceeded = await exceededGrouplimit(db, user);
      if (exceeded) {
        res.json({exceeded: true});
      }else {
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

const groupUpsert = (db, group, groupTrim, user) => {
  try {
    //add to DB for returning user persistence
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

    db.collection('users').updateOne(
      { name: user },
      {
        $inc:
        {
          owned_kgroups: 1
        }
      }
    )

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
    //res.status(500).json({ message: `groupUpsert DB error: ${err}` });
  }
}

router.post('/delete', async (req, res) => {
  const db = req.app.locals.db;
  let { group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const groupDeleted = await deleteGroup(db, group, user);
    if (!groupDeleted) {
       res.json(false);
    }else {
      res.json(true);
    }
  }
})

const deleteGroup = (db, group, user) => {
  try {
    //delete from kgroups collection
    db.collection('kgroups').deleteOne(
      { name: group }
    )

    //delete all group_access associated with group
    db.collection('kgroups_access').deleteMany(
      { group: group }
    )

    //delete all posts associated with group
    db.collection('kposts').deleteMany(
      { group: group }
    )

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
    //res.status(500).json({ message: `groupUpsert DB error: ${err}` });
  }
}

export default router;
