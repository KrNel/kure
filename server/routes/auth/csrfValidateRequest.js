import config from '../../config';

const csrfValidateRequest = async (req, res, user) => {
  const db = req.app.locals.db;

  const csrfHeader = req.header(config.csrfToken);
  const valid = db.collection('sessions').find({user: user}, {projection: {csrf: 1, _id: 0}}).limit(1).toArray().then(result => {
    if (result.length && csrfHeader === result[0].csrf) {
      return true;
    }
    return false; //csrf failed
  }).catch(err => {
		throw new Error('Error validateing CSRF with DB: ', err);
	});

  return await valid;
}

export default csrfValidateRequest;
