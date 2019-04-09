import { Router } from 'express';
import groups from './groups';
import recentActivity from './recentActivity';
import auth from './auth/auth';
import manage from './manage/manage';
import posts from './posts';

//Routes to use for /api/ root path
const router = new Router();
router.use('/groups', groups);
router.use('/recentactivity', recentActivity);
router.use('/auth', auth);
router.use('/manage', manage);
router.use('/posts', posts);

export default router;
