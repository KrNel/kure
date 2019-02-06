import { Router } from 'express';
import groups from './groups';
import recentPosts from './recentPosts';
//const initialState = serialize(response);
//var html = xss('<script>alert("xss");</script>');

//Routes to use for /api/ root path
const router = new Router();
router.use('/groups', groups);
router.use('/recentPosts', recentPosts);

export default router;
