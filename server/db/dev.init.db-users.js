/*
mongo dec.init.db.js

mongo
show databases
use kure
show collections
db.users.find().pretty();
*/



db = new Mongo().getDB('kure');
db.users.remove({});
db.users.insertOne(
	{
		name: 'johnny',
		display: 'Johnny',
		created: new Date('2018-12-24T09:38:15Z'),
		votes_cast: 10
	},
	{
		name: 'sal',
		display: 'Sal',
		created: new Date('2018-12-24T09:45:15Z'),
		votes_cast: 4
	}
);

db.users.createIndex({ name: 1 });

//users

//list_access

// followers

// list_posts

//list_comments

//list_rating

//post_rating
