import { Router } from 'express';

import config from '../../../config';
import SteemConnect from '../../../../client/src/utils/auth/scAPI';

//import logger from '../../logger';

const router = new Router();

router.post('/post', (req, res, next) => {
  /*const db = req.app.locals.db;
  const user = req.params.user;
  const type = req.params.type;*/
  /*const accessToken = req.cookies[config.scCookie];
  SteemConnect.setAccessToken(accessToken;*/
  /*SteemConnect.me((err, res) => {
    console.log('err:',err)
    console.log('res:',res)
  })*/
  /*const upvoted = upvote();
console.log('upvoted:',upvoted)
  res.json({ upvoted: upvoted });*/
  //Get group data from DB and return

})

/*const upvote = () => {
  return new Promise((resolve, reject) => {
    SteemConnect.vote('krnel', 'swedishdragon', 're-krnel-100-unofficially-confirmed-the-u-s-justice-department-is-going-after-julian-assange-wikileaks-20190306t155045169z', 1)
      .then((err, res) => {
        (!err) ? resolve(res) : reject(err);
  console.log('err:',err)
  console.log('res:',res)
      })
  }).catch(err => {
console.log('err:',err)
  });
}*/

export default router;
