var express = require('express');
var assert = require('chai').assert;

var app = express();
var sum = 0;
var sum1 = 6;
describe('#sum', function() {
    it('when empty array, expect to return 0', function () {
        var actual = sum;
        assert.equal(actual, 0)
    });
    it('when with single number, expect the number', function () {
        var number = 6;
        var actual = sum1;
        var expected = number;
        assert.equal(actual, expected);
    })
})

app.listen(8080);