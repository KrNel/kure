import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import morgan from 'morgan';
import helmet from 'helmet';
import Tokens from 'csrf';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import config from '../config'
import SteemConnect from '../client/src/utilities/auth/scAPI'

const ORIGIN_HOST = `${config.app.client.host}:${config.app.client.port}`;

const app = express();
app.set('port', (config.app.server.port || 3001));
if (config.app.env !== 'TEST') {
  //let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
  /*app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))*/

  //app.use(morgan('combined'));
}

//set headers on nginx sever when setup
app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let db;
MongoClient.connect(`mongodb://${config.db.host}:${config.db.port}`, { useNewUrlParser: true }).then(connection => {
	db = connection.db(config.db.name);
}).catch(err => {
	console.error('DB ERROR:', err);
});

app.use(cookieParser());
let tokens = new Tokens();
const SC_COOKIE = "SC-TOKEN";
const CSRF_TOKEN = "x-csrf-token";

/**
 *
 *
 */
//add same origin check for dev/prod header? ignore if from elsewhere
//const forwardFrom = req.headers['x-forwarded-host'];
app.post('/auth/validate', (req, res, next) => {
  if (ORIGIN_HOST !== req.headers['x-forwarded-host']) res.json({"isAuth": false});
  const isAuth = false;
  //console.log('body: ', req.body);
  //console.log('headers: ', req.headers);
  const expiresAt = req.body.expiresAt;
  const accessToken = req.body.accessToken;
  const user = req.body.user;

  //verify accessToken on SteemConnect, not fake
  validateToken(accessToken)
    .then(valid => {
      if (valid) return setTokenCookie(res, expiresAt, accessToken)
    }).then(set => {
      if (set) return initUser(user)
    }).then(init => {
      if (init) return newCSRF(res, user)
    }).then(isAuth => {
      if (isAuth) res.json({ isAuth: isAuth, user: user });
    }).catch(err => console.error(err) );
})

const validateToken = (accessToken) => {
  //what happens if stemconnect is offline? test it
  return new Promise((resolve, reject) => {
    SteemConnect.setAccessToken(accessToken);
    SteemConnect.me((err, result) => {
      (!err) ? resolve(true) : reject(false);
    })
    resolve(true);
  });
}

const setTokenCookie = (res, expiresAt, accessToken) => {
  return new Promise((resolve, reject) => {
    res.cookie(SC_COOKIE, accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: expiresAt
    });
    resolve(true);
  });
}

const initUser = (user) => {
  return new Promise((resolve, reject) => {
    let success = false;
    try {
      //add to DB for returning user persistence
      const joined = new Date();
      db.collection('users').updateOne(
        {user: user},
        {
          $setOnInsert: {
            name: user,
            display: user,
            joined: joined,
            votes: {
        			curating: 0,
        			writing: 0
        		},
        		posts: {
        			curating: 0,
        			writing: 0
        		},
        		owned_kgroups: 0,
						owned_limit: 4
          }
        },
        { upsert:true }
      )
      success = true;
    }catch (err) {
      reject(success);
      console.error(err);
      res.status(500).json({ message: `initUser DB upsert: ${err}` });
    }
    resolve(success);
  })
}

const newCSRF = (res, user) => {
  return new Promise((resolve, reject) => {
    const secret = tokens.secretSync();
    const csrf = tokens.create(secret);
    let success = false;
    try {
      //add to DB for returning user persistence
      db.collection('sessions').updateOne(
        { user: user },
        {
          $set:
          {
            user: user,
            csrf: csrf,
            /*votes_cast: 0,
            submissions: 0*/
          }
        },
        { upsert: true }
      )
      success = true;
    }catch (err) {
      reject(success);
      console.error(err);
      res.status(500).json({ message: `newCSRF DB upsert: ${err}` });
    }

    if (success) res.set(CSRF_TOKEN, csrf);
    resolve(success);
  })
}

/**
 *
 *
 */
app.get('/auth/returning', (req, res, next) => {
//console.log(req.headers);
  if (ORIGIN_HOST !== req.headers['x-forwarded-host']) res.json({isAuth: false, user:''}); //log the CSRF attempt?


  //const csrfHeader = req.header[CSRF_TOKEN];
  const accessToken = req.cookies[SC_COOKIE];
//console.log('accessToken: ', accessToken);
  returning(res, accessToken)
    .then(ret => {
      res.json(ret);
    })
    .catch(err => { console.error(err); });
})

const returning = async (res, accessToken) => {
  const fail = {isAuth: false, user:''};
  if (!accessToken) return fail;

  SteemConnect.setAccessToken(accessToken);
  SteemConnect.me((err, result) => {
    if (err) return fail;
  })

  const user = jwt.decode(accessToken)['user'];
  return (newCSRF(res, user))
    ? {
        isAuth: true,
        user: {
          name: user
        }
      }
    : fail;
  /*const ret = await new Promise((resolve, reject) => {
    db.collection('sessions').findOne({"csrf": csrfHeader}, {user: 1},  (err, result) => {
      err
        ? reject(err)
        : resolve({isAuth: true, user: { user: result.user }});
    })
  });*/
  //return ret;
}

const csrfValidateRequest = async (req, user) => {
  const csrfHeader = req.header(CSRF_TOKEN);

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

/*
  https://stackoverflow.com/questions/23494956/how-to-use-morgan-logger
  https://github.com/strongloop/strong-error-handler
  https://stackoverflow.com/questions/43054203/nodejs-expressjs-how-to-log-errors-for-the-production-server
  */

/**
 *
 *
 */
app.post('/auth/logout', (req, res, next) => {
  const user = req.body.user;

  if (!user) res.json({invalid: true})

  logout(res, user)
    .then(loggedOut => res.json({loggedOut: loggedOut}))
    .catch(err => {
      //next(err);
      console.error(err);
      //res.status(500).json({ message: `/auth/logout: ${err}` });
    });
})

const logout = async (res, user) => {

  res.clearCookie(SC_COOKIE);

  try {
    db.collection('sessions').deleteOne({"user": user});
  }catch (err) {
    console.error(err);
    //res.status(500).json({ message: `/auth/logout DB delete: ${err}` });
  }
//SteemConnect.options.accessToken
  await SteemConnect.revokeToken((err, ret) => {
    if (!ret || err) {
      console.error('Error in revokeToken');
    }
    //if (err) throw new Error ('error in revokeToken');
  });

  return true;
}

/*********************************************
 *          API CALLS SECTION
 */

app.get('/api/recentposts', (req, res, next) => {
  db.collection('kposts').find().limit(10).toArray().then(posts => {
		res.json({ posts: posts })
	}).catch(error => {
		console.error(error);
		res.status(500).json({ message: `Error with /api/recentposts: ${error}` });
	});
})

/**
 *
 *
 */
app.get('/api/groups/user/:name', (req, res, next) => {
  const user = req.params.name;

  getUserGroups(user)
    .then(data => {
      res.json({ groups: data })
    })
    .catch(error => {
  		console.error(error);
  		res.status(500).json({ message: `Error with /api/groups/user/:name: ${error}` });
  	});
})

const getUserGroups = async (user) => {
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
app.get('/api/groups/:group/:user', async (req, res, next) => {
  const { group, user } = req.params;
  //const user = req.params.user;

  const groupName = getGroupDisplayName(group);
  const groupPosts = getGroupPosts(group);
  const groupUsers = getGroupUsers(group);
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

const getGroupDisplayName = async (group) => {
  return new Promise((resolve, reject) => {
    db.collection('kgroups').findOne({name: group}, {projection: {display: 1, _id: 0 }}, (err, result) => {
      if (err) { console.error('err: ', err); }
      resolve(result);
  	})
  })
}

const getGroupPosts = async (group) => {
  return new Promise((resolve, reject) => {
    db.collection('kposts').find({group: group}).sort( { created: -1 } ).toArray().then(data => {
  		resolve(data);
  	})
  })
}

const getGroupUsers = async (group) => {
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


/*********************************************
 *        MANAGE SECTION
 */

//const initialState = serialize(response);
//var html = xss('<script>alert("xss");</script>');
app.post('/manage/groups/add', async (req, res, next) => {

  let { group, user } = req.body;
  group = group.trim();
  const groupClean = group.toLowerCase().replace(/\s/g, '-');

  const csrfValid = await csrfValidateRequest(req, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const exists = await groupExists(groupClean);
    if (exists) {
       res.json({exists: true});
    }else {
      const exceeded = await exceededGrouplimit(user);
      if (exceeded) {
        res.json({exceeded: true});
      }else {
        const created = groupUpsert(group, groupClean, user);
        res.json({
          group: {
            name: groupClean,
            display: group,
            owner: user,
            followers: 1,
            likes: 1,
            created: created,
            posts: 0
          }
        });
      }
    }
  }
})

const groupExists = async (group) => {
  const exists = db.collection('kgroups').find({name: group}, {projection: {name: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(error => {
		console.error(error);
		res.status(500).json({ message: `Error with DB groupExists: ${error}` });
	});
  return await exists;
}

const exceededGrouplimit = async (user) => {
  const exceeded = db.collection('users').find({name: user, 'owned_kgroups': {$gte: 4}}, {projection: {name: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(error => {
		console.error(error);
		res.status(500).json({ message: `Error with DB groupExists: ${error}` });
	});
  return await exceeded;
}

const groupUpsert = (group, groupTrim, user) => {
  try {
    //add to DB for returning user persistence
    const created = new Date();
    db.collection('kgroups').updateOne(
      { name: groupTrim },
      {
        $set:
        {
          name: groupTrim,
          display: group,
          created: created,
          owner: user,
          followers: 1,
      		likes: 1,
          posts: 0,
          rating: 0
        }
      },
      { upsert: true }
    )

    db.collection('users').updateOne(
      { name: user },
      {
        $inc:
        {
      		owned_kgroups: 1
        }
      }
    )

    db.collection('kgroups_access').insertOne(
      {
        group: groupTrim,
        user: user,
        access: 0,
      }
    )

    return created;
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: `groupUpsert DB error: ${err}` });
  }
}

app.post('/manage/groups/delete', async (req, res, next) => {
  let { group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const groupDeleted = await deleteGroup(group, user);
    if (!groupDeleted) {
       //res.status(500).json({ message: `failed to delete group ${group}: ${err}` });
       res.json(false);
    }else {
      res.json(true);
    }
  }
})

const deleteGroup = (group, user) => {
  try {
    //delete from kgroups collection
    db.collection('kgroups').deleteOne(
      { name: group }
    )

    //delete all group_access associated with group
    db.collection('kgroups_access').deleteMany(
      { group: group }
    )

    //delete all posts associated with group
    db.collection('kposts').deleteMany(
      { group: group }
    )

    db.collection('users').updateOne(
      { name: user },
      {
        $inc:
        {
      		owned_kgroups: -1
        }
      }
    )
    return true;
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: `groupUpsert DB error: ${err}` });
  }
  return false;
}




app.post('/manage/posts/add', async (req, res, next) => {
  //do i need to verfiy access? no one can spoof a POST, right?

  const { post, user, group } = req.body;

  const csrfValid = await csrfValidateRequest(req, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const [ match, domain, category, author, permlink ] = parseURL(post);

    const exists = await postExists(permlink, group);
    if (exists) {
       res.json({exists: true});
    }else {
      const postAdd = await addPost(user, group, category, author, permlink);
      if (postAdd) {
         res.json({post: postAdd});
      }else {
        res.json({post: postAdd});
        //res.status(500).json({ message: `failed to delete group ${group}: ${err}` });
      }
    }
  }
})

function parseURL(url) {
    return url.match(/:\/\/(:?[\d\w\.]+)?\/([\d\w_-]+)?\/@([\d\w_-]+)?\/([\d\w_-]+)?$/i)
}

const postExists = async (permlink, group) => {
  const exists = db.collection('kposts').find({st_permlink: permlink, group: group}, {projection: {_id: 1 }}).limit(1).toArray().then(data => {
    if (data.length) {
      return true;
    }
    return false;
  }).catch(error => {
		console.error(error);
		res.status(500).json({ message: `Error with DB postExists: ${error}` });
	});
  return await exists;
}

const addPost = (user, group, category, author, permlink) => {
  try {
    const created = new Date();

    const post = {
      added_by: user,
      group: group,
      created: created,
      likes: 0,
      views: 0,
      st_permlink: permlink,
      st_author: author,
      st_category: category,
      st_title: permlink,
      st_upvotes: 0,
      st_payout: "0",
      st_comments: 0,
      rating: 0
    }

    db.collection('kposts').insertOne(
      post
    )

    db.collection('kgroups').updateOne(
      { name: group },
      {
        $inc:
        {
          posts: 1
        }
      }
    )
    return post;
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: `groupUpsert DB error: ${err}` });
  }
  return false;
}



app.post('/manage/posts/delete', async (req, res, next) => {
  let { post, group, user } = req.body;
  const csrfValid = await csrfValidateRequest(req, user);

  if (!csrfValid) res.json({invalidCSRF: true});
  else {
    const postDeleted = await deletePost(post, group);
    if (postDeleted) {
      res.json(true);
    }else {
      //res.status(500).json({ message: `failed to delete group ${group}: ${err}` });
      res.json(false);
    }
  }
})

const deletePost = (post, group) => {
  try {
    //delete from kgroups collection
    db.collection('kposts').deleteOne(
      { st_permlink: post, group: group }
    )

    db.collection('kgroups').updateOne(
      { name: group },
      {
        $inc:
        {
          posts: -1
        }
      }
    )
    return true;
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: `groupUpsert DB error: ${err}` });
  }
  return false;
}



app.post('/manage/post', (req, res, next) => {

})


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
})

/*app.post('/auth/validate', (req, res, next) => {

  console.log('Inside: POST /auth/validate callback function');
  console.log('body: ', req.body);
  console.log('headers: ', req.headers);
  res.status(200).json({ auth: true });
  //const url = getLoginURL();

  //x-forwarded-host
  //origin - cant be added by JS
  //referer - cant be added by JS
})*/


export default app;
