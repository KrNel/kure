import config from '../../config';

const csrfValidateRequest = async (req, res, user) => {
  const db = req.app.locals.db;

  const csrfHeader = req.header(config.csrfToken);
  const valid = db.collection('sessions').find({user: user}, {projection: {csrf: 1, _id: 0}}).limit(1).toArray().then(result => {
    if (result.length && csrfHeader === result[0].csrf) {
      return true;
    }
    return false; //csrf failed
  }).catch(error => {
		console.error(error);
		res.status(500).json({ message: `Error with DB groupExists: ${error}` });
	});

  return await valid;
}

export default csrfValidateRequest;
