var saltHashPassword = require('../feature_functions/encryption').saltHashPassword;
const assert = require('chai').assert;

describe('Test password encryption w/ sha512 algorithm + 16 character long string salting', function () {
    it("Should return an object with 2 key/value pairs (key1='salt'; key2='passwordHash'", (done) => {
        var result = saltHashPassword("AmazingPassword");
        var result_type = typeof result;
        assert.equal(result_type, "object");
        var keys = Object.keys(result);
        var key_amt = keys.length;
        assert.equal(key_amt, 2);
        var key1 = keys[0];
        assert.equal(key1, 'salt');
        var key2 = keys[1];
        assert.equal(key2, 'passwordHash');
        done()
    });
});

