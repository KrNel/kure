import config from '../../../config';

/**
 *  Validate the CSRF token for POST fetch requests
 *
 *  @param {object} req Request object received from the frontend
 *  @param {object} res Response object to send to the frontend
 *  @param {string} user Logged in user $name
 *  @returns  {boolean} Determines if CSRF validation succeeded
 */
const csrfValidateRequest = async (req, res, user) => {
  const db = req.app.locals.db;

  //Get the CSRF token from the request header
  const csrfHeader = req.header(config.csrfToken);

  //Validate header token with session token
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
