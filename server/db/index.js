const mongoose = require('mongoose');
//const { connection, Schema} = mongoose;

//in app root
mongoose.connect(
  'mongodb://localhost:27017/kure'
).catch(console.error);

/*const db = mongoose.connect(
	'mongodb://test:test@localhost:7331/test'
).then(conn => conn).catch(console.error)*/
