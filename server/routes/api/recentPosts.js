import { Router } from 'express';

import config from '../../config';

const router = new Router();

router.get('/', (req, res, next) => {
  const db = req.app.locals.db;

  db.collection('kposts').find().limit(10).toArray().then(posts => {
		res.json({ posts: posts })
	}).catch(err => {
		throw new Error('Error getting recent posts from DB: ', err);
	});
})

export default router;
