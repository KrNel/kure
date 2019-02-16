import { Router } from 'express';
import groups from './groups';
import recentActivity from './recentActivity';
//const initialState = serialize(response);
//var html = xss('<script>alert("xss");</script>');

//Routes to use for /api/ root path
const router = new Router();
router.use('/groups', groups);
router.use('/recentActivity', recentActivity);

export default router;
