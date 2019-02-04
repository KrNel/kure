import { Router } from 'express';

const router = new Router();

router.get('/user/:name', (req, res) => {
  const user = req.params.name;
  const db = req.app.locals.db;

  getUserGroups(db, user)
    .then(data => {
      res.json({ groups: data })
    })
    .catch(err => {
      throw new Error('Error getting groups from DB: ', err);
    });
})

const getUserGroups = async (db, user) => {
  const groups = db.collection('kgroups').find({owner: user}).sort( { created: -1 } ).toArray().then(data => {
		return data;
	}).catch(err => {
		throw new Error('Error getting groups from DB: ', err);
	});
  return await groups;
}

/**
 *
 *
 */
router.get('/:group/:user', async (req, res) => {
  const db = req.app.locals.db;
  const { group } = req.params;

  const groupName = getGroupDisplayName(db, group);
  const groupPosts = getGroupPosts(db, group);
  const groupUsers = getGroupUsers(db, group);

  Promise.all([groupName, groupPosts, groupUsers]).then((result) => {
    res.json({
      group: {
        name: group,
        display: result[0]['display']
      },
      posts: result[1],
      users: result[2]
    })
  })
})

const getGroupDisplayName = async (db, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups').findOne({name: group}, {projection: {display: 1, _id: 0 }}, (err, result) => {
      if (result) resolve(result);
      else reject;
    })
  })
}

const getGroupPosts = async (db, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kposts').find({group: group}).sort( { created: -1 } ).toArray().then(result => {
      if (result) resolve(result);
      else reject;
    })
  })
}

const getGroupUsers = async (db, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups_access').find({group: group}).sort( { user: 1 } ).toArray().then(result => {
      if (result) resolve(result);
      else reject;
    })
  })
  //do a join, aggregation
  //kgroups_access.user === users.name
  //https://gist.github.com/bertrandmartel/311dbe17c2a57e8a07610724310bf898
  /*
  return new Promise((resolve, reject) => {
    db.collection('kgroups_access').aggregate([
      {
        $match : {
          group : group
        }
      }, {
        $lookup: {
          from: 'kgroups',
          let: { access_group: "$group" },
          pipeline: [{
            $match: {
              $expr: {
                $eq: [ "$name",  "$$access_group" ]
              }
            },
              { $project: { user: 1, _id: 0 } }
          }],
          as: 'kgroup'
        }
      }//{        $sort: {          user: 1        }      }{ $project: { _id: 0 } }

    ]).toArray((err, result) => {
console.log("result: ", result);
    err
      ? reject(err)
      : resolve(result);
    })
  })*/
}

export default router;
