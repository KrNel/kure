import { Router } from 'express';

import config from '../../config';
import csrfValidateRequest from '../auth/csrfValidateRequest';

const router = new Router();


//const initialState = serialize(response);
//var html = xss('<script>alert("xss");</script>');
router.post('/groups/add', async (req, res) => {
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
  }).catch(error => {
		console.error(error);
		//res.status(500).json({ message: `Error with DB groupExists: ${error}` });
	});
  return await exists;
}

const exceededGrouplimit = async (db, user) => {
  const exceeded = db.collection('users').find({name: user, 'owned_kgroups': {$gte: 4}}, {projection: {name: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(error => {
		console.error(error);
		//res.status(500).json({ message: `Error with DB groupExists: ${error}` });
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
      }
    )

    return created;
  }catch (err) {
    console.error(err);
    //res.status(500).json({ message: `groupUpsert DB error: ${err}` });
  }
}

router.post('/groups/delete', async (req, res) => {
  const db = req.app.locals.db;
  let { group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const groupDeleted = await deleteGroup(db, group, user);
    if (!groupDeleted) {
       //res.status(500).json({ message: `failed to delete group ${group}: ${err}` });
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
    console.error(err);
    //res.status(500).json({ message: `groupUpsert DB error: ${err}` });
  }
  return false;
}




router.post('/posts/add', async (req, res) => {
  const db = req.app.locals.db;
  //do i need to verfiy access? no one can spoof a POST, right?

  const { post, user, group } = req.body;

  const csrfValid = await csrfValidateRequest(req, res, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const [ match, domain, category, author, permlink ] = parseURL(post);

    const exists = await postExists(db, permlink, group);
    if (exists) {
       res.json({exists: true});
    }else {
      const postAdd = await addPost(db, user, group, category, author, permlink);
      if (postAdd) {
         res.json({post: postAdd});
      }else {
        res.json({post: postAdd});
        //res.status(500).json({ message: `failed to delete group ${group}: ${err}` });
      }
    }
  }
})

function parseURL(url) {
    return url.match(/:\/\/(:?[\d\w\.]+)?\/([\d\w_-]+)?\/@([\d\w_-]+)?\/([\d\w_-]+)?$/i)
}

const postExists = async (db, permlink, group) => {
  const exists = db.collection('kposts').find({st_permlink: permlink, group: group}, {projection: {_id: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(error => {
		console.error(error);
		//res.status(500).json({ message: `Error with DB postExists: ${error}` });
	});
  return await exists;
}

const addPost = (db, user, group, category, author, permlink) => {
  try {
    const created = new Date();

    const post = {
      added_by: user,
      group: group,
      created: created,
      likes: 0,
      views: 0,
      st_permlink: permlink,
      st_author: author,
      st_category: category,
      st_title: permlink,
      st_upvotes: 0,
      st_payout: "0",
      st_comments: 0,
      rating: 0
    }

    db.collection('kposts').insertOne(
      post
    )

    db.collection('kgroups').updateOne(
      { name: group },
      {
        $inc:
        {
          posts: 1
        }
      }
    )
    return post;
  }catch (err) {
    console.error(err);
    //res.status(500).json({ message: `groupUpsert DB error: ${err}` });
  }
  return false;
}



router.post('/posts/delete', async (req, res) => {
  const db = req.app.locals.db;
  let { post, group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const postDeleted = await deletePost(db, post, group);
    if (postDeleted) {
      res.json(true);
    }else {
      //res.status(500).json({ message: `failed to delete group ${group}: ${err}` });
      res.json(false);
    }
  }
})

const deletePost = (db, post, group) => {
  try {
    //delete from kgroups collection
    db.collection('kposts').deleteOne(
      { st_permlink: post, group: group }
    )

    db.collection('kgroups').updateOne(
      { name: group },
      {
        $inc:
        {
          posts: -1
        }
      }
    )
    return true;
  }catch (err) {
    console.error(err);
    //res.status(500).json({ message: `groupUpsert DB error: ${err}` });
  }
  return false;
}


export default router;
