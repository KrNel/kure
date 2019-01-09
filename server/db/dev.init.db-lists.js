/*
mongo dec.init.db.js

mongo
show databases
use kure
show collections
db.lists.find().pretty();
*/



db = new Mongo().getDB('kure');
db.lists.remove({});
db.lists.insertOne(
	{
		name: 'psyche',
		display: 'Psyche',
		created: new Date('2018-12-24T10:38:15Z'),
		owner_id: 'KrNel',
		followers: 3
	}
);

db.lists.createIndex({ name: 1 });

//users

//list_access

// followers

// list_posts

//list_comments

//list_rating

//post_rating
