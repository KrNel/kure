import { Router } from 'express';
import groups from './groups';
import recentActivity from './recentActivity';
import auth from './auth/auth';
import manage from './manage/manage';
import steem from './steem/steem';
//const initialState = serialize(response);
//var html = xss('<script>alert("xss");</script>');

//Routes to use for /api/ root path
const router = new Router();
router.use('/groups', groups);
router.use('/recentactivity', recentActivity);
router.use('/auth', auth);
router.use('/manage', manage);
router.use('/steem', steem);

export default router;
