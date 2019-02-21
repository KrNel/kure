import { Client } from 'dsteem';

//Regex for URL validation
const urlRegex = /:\/\/(:?[\d\w\.]+)?(?:\/[\d\w_-]+)?\/@([\.\d\w_-]+)?\/([\d\w_-]+)?$/;// eslint-disable-line

/**
 *  Validate group creation attempts.
 *
 *  @param {string} group Name of the group to create
 *  @returns {[bool, object]} If errors found, and the errors
 */
export const groupValidation = (newGroup) => {
  let valid = true;
  let errors = {};

  if(!newGroup){
    errors["newGroup"] = "Cannot be empty";
    valid = false;
    return {valid, errors};
  }

  if(valid && (newGroup.length < 3 || newGroup.length > 17)){

    errors["newGroup"] = "Must be between 4 and 17 chars.";
    valid = false;
    return {valid, errors};
  }

  if(valid && !/^[\d\w\s_-]+$/.test(newGroup)) {
    errors["newGroup"] = "Only letters, numbers, spaces, underscores or hyphens.";
    valid = false;
    return {valid, errors};
  }

  return {valid, errors};
}

/**
 *  Validate post adding attempts.
 *
 *  @param {string} newPost Post URL to add to group
 *  @returns {[bool, object, object]} If errors found, errors, and post data
 */
export const postValidation = async (newPost) => {
  let valid = true;
  let errors = {};

  if(!newPost){
    errors["newPost"] = "Cannot be empty";
    valid = false;
    return {valid, errors};
  }

  if(valid && !urlRegex.test(newPost)) {
    errors["newPost"] = "Invalid URL";
    valid = false;
    return {valid, errors};
  }

  const steemRes = await getFromSteem(newPost);
  if (!steemRes.exists) {
    errors["newPost"] = "That post doesn't exist on Steem";
    valid = false;
  }

  return await {valid, errors, res: {
    author: steemRes.author,
    category: steemRes.category,
    permlink: steemRes.permlink,
    title: steemRes.title,
  }};
}

/**
 *  Fetch post data from Steem blockchain based on URL provided.
 *
 *  @param {string} group URL to get data from Steem
 *  @returns {[bool, object]} If errors found, and the errors
 */
export const getFromSteem = async (url) => {

  const [ match, domain, author, permlink ] = parseURL(url);//eslint-disable-line
  const client = new Client('https://hive.anyx.io/');

  const res = client.database.call('get_content', [author, permlink]).then(result => {
    if (result) {
      const {author, category, permlink, title} = result;
      return {
        exists: true,
        author,
        category,
        permlink,
        title,
      } ;
    } else return {exists: false};
  });
  return await res;
}

/**
 *  Split up the URL into data segments for inserting into DB.
 */
const parseURL = (url) => {
    return url.match(urlRegex) // eslint-disable-line no-useless-escape
}

/**
 *  Validate user addition attempts.
 *
 *  @param {string} newUser Name of the user to add
 *  @returns {[bool, object]} If errors found, and the errors
 */
export const userValidation = (newUser) => {
  let valid = true;
  let errors = {};

  if(!newUser){
    errors["newUser"] = "Cannot be empty";
    valid = false;
    return {valid, errors};
  }

  if(valid && !/^[a-z\d\.-]{3,16}$/.test(newUser)) { // eslint-disable-line no-useless-escape
    errors["newUser"] = "Invaid Steem name.";
    valid = false;
    return {valid, errors};
  }

  /*//if user exists (check users obj)
  if(valid)) {
    errors["newUser"] = "Must be a valid URL";
    valid = false;
  }*/

  return {valid, errors};
}

export default groupValidation;
