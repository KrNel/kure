/**
 *  Will verify that the action being requested (add or delete) is
 *  allowd by the user requesting it for a particular section.
 *
 *  @param {object} db MongoDB connection
 *  @param {string} group Group to verify
 *  @param {string} user User currently logged in
 *  @param {string} section Section being affected
 *  @param {string} action User currently logged in
 *  @returns {boolean} Determines if user is authorized to do action
 */
export const verifyAccess = async (db, next, group, user, section, action) => {
  const access = await db.collection('kgroups_access').find({group: group, user: user}, {projection: {access: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return data[0];
    }
    return false;
  }).catch(err => {
		next(err);
	});

  if (action === 'add') {
    if (section === 'post' && access.access < 4) return true;
    if (section === 'user' && access.access < 3) return true;
    if (section === 'pending' && access.access < 3) return true;
  }else if (action === 'del') {
    if (section === 'group' && access.access === 0) return true;
    if (section === 'post' && access.access < 3) return true;
    if (section === 'user' && access.access < 2) return true;
    if (section === 'pending' && access.access < 3) return true;
  }

  return false;
}

export default verifyAccess;
