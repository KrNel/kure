import { Router } from 'express';

import { getRecentPosts } from './recentActivity';

const router = new Router();

/**
 *  GET route to get the recent post activity.
 *  Route: /api/recentposts/posts
 *
 *  Gets the local DB object.
 *  Retrieve the recently active posts from the DB.
 */
router.get('/:limit/:nextId?', (req, res, next) => {
  const db = req.app.locals.db;
  const limit = parseInt(req.params.limit);
  const nextId = req.params.nextId;

  //Get posts data from DB and return
  getRecentPosts(db, next, limit, nextId)
    .then(data => {
      res.json({ posts: data })
    })
    .catch(next);
})

export default router;
