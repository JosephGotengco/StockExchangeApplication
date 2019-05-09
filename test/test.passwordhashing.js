const bcrypt = require('bcrypt');
const assert = require('chai').assert;
// const expect = require('chai').expect;
// var utils = require('../utils');
// var mongoose = require('mongoose');
// const MongoClient = require('mongodb').MongoClient;

// mongoose.connect("mongodb://localhost:27017/accounts", { useNewUrlParser: true });

var saltRounds = 10;
// var db = utils.getDb();

// describe('encryptPass', function() {
// 	it('passwords should match and return true ', function() {
// 		user = {
// 			firstname: 'Test',
// 			lastname: 'Test',
// 			username: 'test123',
// 			password: 'abc123',
// 			type: 'standard',
// 			cash2: [10000],
// 			stocks: []
// 		};
// 		console.log(user['username']);
// 		console.log(user['password']);
// 		bcrypt.hash(user['password'], saltRounds, function(err, hash) {
// 			if(err){
// 				console.log(err);
// 			}else{
// 			db.collection('user_accounts').findOne({username: user['username']}, function(err, result) {
// 				if(result === null) {
// 					db.collection('user_accounts').insertOne({
// 						firstname: user['firstname'],
// 						lastname: user['lastname'],
// 						username: user['username'],
// 						password: hash,
// 						type: user['type'],
// 						cash2: user['cash2'],
// 						stocks: user['stocks']
// 				}, (err, result) => {
// 						if (err) {
// 							message = `There was an error in creating your account. Please try again.`;
// 							console.log(message)
// 						}
// 						message = 'Account successfully created';
// 						console.log(message)
// 						console.log(db.collection('user_accounts').findOne({username: user['username']}).toArray());
// 					})}
// 		})
// 	}})
// 	})
// })

describe('encrpytPass', function() {
	it('Passwords should match and return true', function(){
		passwords = ['abc123', '123abc', '11111', 'aaaaaa', 'asdakjndksdnv'];
		for(let i =0; i < passwords.length;i++) {
			bcrypt.hash(passwords[i], saltRounds, function(err, hash) {
				if(err){
					console.log("Password did not hash correctly");
				}else {
					bcrypt.compare(passwords[i], hash, function(err, result) {
				// console.log(password);
				// console.log(this.password);
						if(err) {
							console.log(err);
						}
						if(result) {
							// console.log(result);
							// console.log("JASIDOJASDASDASDASDASDa----------")
							assert.isTrue(result);
						}
					})
				}
			})
		}
	});
	it("Passwords shouldn't match and return false", function(){
		passwords = ['abc123', '123abc', '11111', 'aaaaaa', 'asdakjndksdnv'];
		wrongPasswords = ['asdsasdasd', 'asdasfasa', 'afasfafsa', 'xcvxcvxc', '5346546']
		for(let i =0; i < passwords.length;i++) {
			bcrypt.hash(passwords[i], saltRounds, function(err, hash) {
				if(err){
					console.log("Password did not hash correctly");
				}else {
					// console.log(hash);
					// console.log(wrongPasswords[i]);
					bcrypt.compare(wrongPasswords[i], hash, function(err, result) {
						console.log(wrongPasswords[i]);
				// console.log(this.password);
						if(err) {
							console.log(err);
							// assert.isFalse(result);
						}
						if(result) {
							// console.log('akdnskdjngkjdsnsdnasnlnclzkncnalkdna')
							// console.log(result);
							assert.isFalse(result);
						}
						else{
							assert.isFalse(result);
						}
					})
				}
			})
		}
	})
})