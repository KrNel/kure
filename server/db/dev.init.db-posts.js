/*
mongo dec.init.db.js

mongo
show databases
use kure
show collections
db.posts.find().pretty();
*/



db = new Mongo().getDB('kure');
db.posts.remove({});
db.posts.insert([
	{
		added_by: "krnel",
		list: "psyche",
		created: new Date('2018-12-24T11:38:15Z'),
		upvotes: 10,
		views: 2,
		st_permlink: "northern-blues-of-a-no-snow-christmas",
		st_author: "krnel",
		st_title: "Northern Blues of a No-Snow Christmas",
		st_upvotes: "94",
		st_payout: "4.95",
		st_comments: "3"
	},
	{
		added_by: "krnel",
		list: "blog",
		created: new Date('2018-12-25T11:38:15Z'),
		upvotes: 6,
		views: 1,
		st_permlink: "a-bright-sunny-blue-skied-christmas-and-cooking-day",
		st_author: "krnel",
		st_title: "A Bright Sunny Blue-Skied Christmas and Cooking Day!",
		st_upvotes: "53",
		st_payout: "3.42",
		st_comments: "1"
	}
]);


//users

//list_access

// followers

// list_posts

//list_comments

//list_rating

//post_rating
