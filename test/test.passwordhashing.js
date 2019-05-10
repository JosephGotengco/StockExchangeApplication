const bcrypt = require('bcrypt');
const assert = require('chai').assert;

var saltRounds = 10;


describe('encrpytPass', function() {
	it('Passwords should match and return true', function(){
		passwords = ['abc123', '123abc', '11111', 'aaaaaa', 'asdakjndksdnv'];
		for(let i =0; i < passwords.length;i++) {
			bcrypt.hash(passwords[i], saltRounds, function(err, hash) {
				if(err){
					console.log("Password did not hash correctly");
				}else {
					bcrypt.compare(passwords[i], hash, function(err, result) {

						if(err) {
							console.log(err);
						}
						if(result) {

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

					bcrypt.compare(wrongPasswords[i], hash, function(err, result) {
						if(err) {
							console.log(err);
						}
						if(result) {

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