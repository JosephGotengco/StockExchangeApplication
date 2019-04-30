
var assert = require("chai");

describe('#sum', function () {
  it('when empty array, expect to return 0', function () {
    var actual = sum([]);
    expect(actual).to.equal(0);
  });
  it('when with single number, expect the number', function () {
    var number = 6;
    var actual = sum([number]);
    var expected = number;
    expect(actual).to.equal(expected);
  });
});
