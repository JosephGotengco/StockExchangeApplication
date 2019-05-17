const MongoClient = require('mongodb').MongoClient;
// const DB_URI = "mongodb://localhost:27017/accounts";
const DB_URI = "mongodb+srv://JosephG:TPSGqjYl9FxhStok@stockexchangeapplication-mdhwe.mongodb.net/accounts";
var _db = null;

module.exports.getDb = function() {
	return _db;
}

module.exports.init = function(callback) {
	MongoClient.connect(DB_URI, function(err, client) {
		if (err) {
			return console.log('Unable to connect to DB');
		}
		_db = client.db('accounts');
		console.log('Successfully connected to MongoDB server');
	})
}