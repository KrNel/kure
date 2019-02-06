import { Router } from 'express';
import csrfValidateRequest from '../auth/csrfValidateRequest';

const router = new Router();

/**
 *  POST route to add a post to a community group.
 *  Route: /manage/posts/add
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  new post to delete, and group to delete from.
 *  Parse the URL of the post to grab data for inserting.
 *  CSRF validation is done. If valid, proceed with database query.
 *  Databse inserted object will be returned to the frontend.
 */
router.post('/add', async (req, res) => {
  //TODO?:do i need to verfiy access? no one can spoof a POST, right?
  const db = req.app.locals.db;
  const { post, user, group } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Parse URL for data
    const [ match, domain, category, author, permlink ] = parseURL(post);// eslint-disable-line no-unused-vars

    //Check if post exists
    const exists = await postExists(db, permlink, group);
    if (exists) {
       res.json({exists: true});
    }else {
      //Insert new post into DB
      const postAdd = await addPost(db, user, group, category, author, permlink);
      res.json({post: postAdd});
    }
  }
})

/**
 *  Split up the URL into data segments for inserting into DB.
 */
const parseURL = (url) => {
    return url.match(/:\/\/(:?[\d\w\.]+)?\/([\d\w_-]+)?\/@([\d\w_-]+)?\/([\d\w_-]+)?$/) // eslint-disable-line no-useless-escape
}

/**
 *  Query the DB to see if a post already exists.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} permlink Steem permlink of post
 *  @param {string} group Group to verify if posts exists in
 *  @returns {boolean} Determines if post exists or not
 */
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

/**
 *  Add a post to a community group.
 *
 *  post object created from supplied data, then inserted
 *  to the 'kposts' collection.
 *
 *  @param {object} db MongoDB Connectioon
 *  @param {string} user User currently logged in
 *  @param {string} group Group name to add to
 *  @param {string} category Category of Steem post
 *  @param {string} author Author name of Steem post
 *  @param {string} permlink Permlink URL of Steem post
 *  @returns {object} Send inserted object back to frontend for use
 */
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

    //Insert the post intothe group
    db.collection('kposts').insertOne(
      post
    )

    //Increment the post count for the group
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

/**
 *  POST route to delete a post from a community group.
 *  Route: /manage/posts/delete
 *
 *  Gets the local DB object, deconstructs the logged in user,
 *  new post to delete, and group to delete from.
 *  CSRF validation is done. If valid, proceed with database query.
 *  Databse delete will be true or false, return response to frontend.
 */
router.post('/delete', async (req, res) => {
  const db = req.app.locals.db;
  let { post, group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Delete post from DB
    const postDeleted = await deletePost(db, post, group);
    if (postDeleted) {
      res.json(true);
    }else {
      res.json(false);
    }
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
const deletePost = (db, post, group) => {
  try {
    //Delete post from kgroups collection
    db.collection('kposts').deleteOne(
      { st_permlink: post, group: group }
    )

    //Decrement the post count for the group
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
