import { Router } from 'express';

import config from '../../config';

const router = new Router();

router.get('/user/:name', (req, res, next) => {
  const user = req.params.name;
  const db = req.app.locals.db;

  getUserGroups(db, user)
    .then(data => {
      res.json({ groups: data })
    })
    .catch(error => {
  		console.error(error);
  		res.status(500).json({ message: `Error with /api/groups/user/:name: ${error}` });
  	});
})

const getUserGroups = async (db, user) => {
  const groups = db.collection('kgroups').find({owner: user}, {_id: 0}).sort( { created: -1 } ).toArray().then(data => {
		return data;
	}).catch(error => {
		console.error(error);
		res.status(500).json({ message: `Error with DB getUserGroups: ${error}` });
	});
  return await groups;
  /*const groups = await new Promise((resolve, reject) => {
    db.collection('groups').aggregate([
        { $match : { owner : user } },
        { $project : { _id: 0 } },
        { $sort: {created: -1}}
      ]).toArray((err, result) => {
  console.log("result: ", result);
      err
        ? reject(err)
        : resolve(result);
      })
    })
  return groups;*/
}

/**
 *
 *
 */
router.get('/:group/:user', async (req, res, next) => {
  const db = req.app.locals.db;
  const { group, user } = req.params;
  //const user = req.params.user;

  const groupName = getGroupDisplayName(db, group);
  const groupPosts = getGroupPosts(db, group);
  const groupUsers = getGroupUsers(db, group);
  //const users = getGroupsUsers(group);

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
      if (err) { console.error('err: ', err); }
      resolve(result);
  	})
  })
}

const getGroupPosts = async (db, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kposts').find({group: group}).sort( { created: -1 } ).toArray().then(data => {
  		resolve(data);
  	})
  })
}

const getGroupUsers = async (db, group) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups_access').find({group: group}, {projection: {_id: 0}}).sort( { user: 1 } ).toArray().then(data => {
  		resolve(data);
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
