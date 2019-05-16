const MongoClient = require('mongodb').MongoClient;

var _db = null;

module.exports.getDb = function() {
	return _db;
}

module.exports.init = function(callback) {
	// MongoClient.connect('mongodb://localhost:27017/test', function(err, client) {
	MongoClient.connect('mongodb+srv://JosephG:TPSGqjYl9FxhStok@stockexchangeapplication-mdhwe.mongodb.net/accounts', function(err, client) {
		if (err) {
			return console.log('Unable to connect to DB');
		}
		_db = client.db('accounts');
		console.log('Successfully connected to MongoDB server');
	})
}