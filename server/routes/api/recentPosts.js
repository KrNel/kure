import { Router } from 'express';

import config from '../../config';

const router = new Router();

router.get('/', (req, res, next) => {
  const db = req.app.locals.db;
  
  db.collection('kposts').find().limit(10).toArray().then(posts => {
		res.json({ posts: posts })
	}).catch(error => {
		console.error(error);
		res.status(500).json({ message: `Error with /api/recentposts: ${error}` });
	});
})

export default router;
