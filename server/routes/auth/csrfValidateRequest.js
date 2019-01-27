import config from '../../config';

const csrfValidateRequest = async (req, res, user) => {
  const db = req.app.locals.db;

  const csrfHeader = req.header(config.CSRF_TOKEN);

  const valid = db.collection('sessions').find({user: user}, {projection: {csrf: 1, _id: 0}}).limit(1).toArray().then(result => {
    if (result.length) {
      return true;
    }
    return false;
  }).catch(error => {
		console.error(error);
		res.status(500).json({ message: `Error with DB groupExists: ${error}` });
	});

  return await valid;
}

export default csrfValidateRequest;
