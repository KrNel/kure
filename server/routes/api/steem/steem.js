import { Router } from 'express';
import upvote from './upvote';

//const initialState = serialize(response);
//var html = xss('<script>alert("xss");</script>');

//Routes to use for /manage/ root
const router = new Router();
router.use('/upvote', upvote);


export default router;
