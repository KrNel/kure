import { Router } from 'express';

import csrfValidateRequest from '../auth/csrfValidateRequest';

const router = new Router();

router.post('/add', async (req, res) => {
  const db = req.app.locals.db;
  //do i need to verfiy access? no one can spoof a POST, right?

  const { post, user, group } = req.body;

  const csrfValid = await csrfValidateRequest(req, res, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {

    const [ match, domain, category, author, permlink ] = parseURL(post);// eslint-disable-line no-unused-vars

    const exists = await postExists(db, permlink, group);
    if (exists) {
       res.json({exists: true});
    }else {
      const postAdd = await addPost(db, user, group, category, author, permlink);
      if (postAdd) {
         res.json({post: postAdd});
      }else {
        res.json({post: postAdd});
      }
    }
  }
})

function parseURL(url) {
    return url.match(/:\/\/(:?[\d\w\.]+)?\/([\d\w_-]+)?\/@([\d\w_-]+)?\/([\d\w_-]+)?$/) // eslint-disable-line no-useless-escape
}

const postExists = async (db, permlink, group) => {
  const exists = db.collection('kposts').find({st_permlink: permlink, group: group}, {projection: {_id: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(err => {
		throw new Error('Error verifying existing post from DB: ', err);
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
    throw new Error('Error adding post to DB: ', err);
  }
}



router.post('/delete', async (req, res) => {
  const db = req.app.locals.db;
  let { post, group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const postDeleted = await deletePost(db, post, group);
    if (postDeleted) {
      res.json(true);
    }else {
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
    throw new Error('Error deleting post from DB: ', err);
  }
}

export default router;
