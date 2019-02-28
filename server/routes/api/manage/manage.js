import { Router } from 'express';
import groups from './groups';
import posts from './posts';
import users from './users';
//const initialState = serialize(response);
//var html = xss('<script>alert("xss");</script>');

//Routes to use for /manage/ root
const router = new Router();
router.use('/groups', groups);
router.use('/posts', posts);
router.use('/users', users);

export default router;
