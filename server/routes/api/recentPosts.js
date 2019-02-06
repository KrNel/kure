import { Router } from 'express';
import config from '../../config';

const router = new Router();

/**
 *  GET route to get the recent post activity.
 *  Route: /api/recentposts
 *
 *  Gets the local DB object.
 *  Resteive the recently active posts from the DB.
 */
router.get('/', (req, res, next) => {
  const db = req.app.locals.db;

  db.collection('kposts').find().sort( { _id: -1 } ).limit(10).toArray().then(posts => {
		res.json({ posts: posts })
	}).catch(err => {
		throw new Error('Error getting recent posts from DB: ', err);
	});
})

export default router;
