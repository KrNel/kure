import { Router } from 'express';
import csrfValidateRequest from '../auth/csrfValidateRequest';
import { verifyAccess } from '../../../utils/verifyAccess';

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
router.post('/add', async (req, res, next) => {

  //TODO?:do i need to verfiy access? no one can spoof a POST, right?
  const db = req.app.locals.db;
  const { user, group, author, category, permlink, title } = req.body;

  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Check if post exists
    const exists = await postExists(db, next, author, permlink, group);
    if (exists) {
       res.json({exists: true});
    }else {
      //Insert new post into DB
      const postAdd = await verifyAccess(db, next, group, user, 'post', 'add') && await addPost(db, next, user, group, category, author, permlink, title);
      res.json({post: postAdd});
    }
  }
})

/**
 *  Query the DB to see if a post already exists.
 *
 *  @param {object} db MongoDB connection
 *  @param {function} next Middleware function
 *  @param {string} permlink Steem permlink of post
 *  @param {string} group Group to verify if posts exists in
 *  @returns {boolean} Determines if post exists or not
 */
const postExists = async (db, next, author, permlink, group) => {
  const exists = db.collection('kposts').find({st_author: author, st_permlink: permlink, group: group}, {projection: {_id: 1 }}).limit(1).toArray().then(data => {
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
 *  Add a post to a community group.
 *
 *  post object created from supplied data, then inserted
 *  to the 'kposts' collection.
 *
 *  @param {object} db MongoDB Connectioon
 *  @param {function} next Middleware function
 *  @param {string} user User currently logged in
 *  @param {string} group Group name to add to
 *  @param {string} category Category of Steem post
 *  @param {string} author Author name of Steem post
 *  @param {string} permlink Permlink URL of Steem post
 *  @param {string} title Title of Steem post
 *  @returns {object} Send inserted object back to frontend for use
 */
const addPost = (db, next, user, group, category, author, permlink, title) => {
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
      st_title: title,
      rating: 0
    }

    //Insert the post intothe group
    db.collection('kposts').insertOne(
      post
    )

    db.collection('kposts').createIndex({added_by: 1, group: 1});

    //Increment the post count for the group
    db.collection('kgroups').updateOne(
      { name: group },
      { $set: { updated: created },
        $inc:
        {
          posts: 1
        }
      }
    )
    return post;
  }catch (err) {
    next(err);
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
router.post('/delete', async (req, res, next) => {
  const db = req.app.locals.db;
  let { author, post, group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, res, user);

  //Respond to frontend with failed CSRF validation, else continue
  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    //Delete post from DB
    const postDeleted = await verifyAccess(db, next, group, user, 'post', 'del') && await deletePost(db, next, author, post, group);
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
 *  @param {function} next Middleware function
 *  @param {string} post Post to remove from the group
 *  @param {string} group Group name to remove from
 *  @returns {boolean} Determines if deleting a post was a success
 */
const deletePost = (db, next, author, post, group) => {
  try {
    //Delete post from kgroups collection
    db.collection('kposts').deleteOne(
      { st_author: author, st_permlink: post, group: group }
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
    next(err);
  }
}

export default router;
