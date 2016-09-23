require('env2')('.env');
var Server = require('./index.js');
var Hoek = require('hoek');

/*
const Mongoose = require('mongoose');
Mongoose.Promise = require('bluebird');
// must go like this for now otherwise the test will not stand up
Mongoose.connect(process.env.MONGO_URI, { db: { safe: true } });
Mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});
*/
Server.init(process.env.PORT, function (err, server) {
  Hoek.assert(!err, err);
  console.log('The server is running on: ', server.info.uri);
});
