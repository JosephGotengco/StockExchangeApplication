var formatDate = require("../feature_functions/formatDate");
const assert = require('chai').assert;

describe('formatDate function tests', () => {
    it("should return a date in the format of yyyy-mm-dd", () => {
        var date = new Date('December 17, 1995 03:24:00');
        var formatted_date = formatDate.formatDate(date);
        assert.equal(formatted_date, "1995-12-17");
    });

    it("should attempt to format an invalid date", () => {
        var invalid_date = "invalid date";
        var formatted_date = formatDate.formatDate(invalid_date);
        assert.equal(formatted_date, false);
    })

    
    it("should attempt to format a number", () => {
        var invalid_date = 1;
        var formatted_date = formatDate.formatDate(invalid_date);
        assert.equal(formatted_date, false);
    })

    it("should attempt to format a float", () => {
        var invalid_date = 1.1;
        var formatted_date = formatDate.formatDate(invalid_date);
        assert.equal(formatted_date, false);
    })

    it("should attempt to format an array", () => {
        var invalid_date = {};
        var formatted_date = formatDate.formatDate(invalid_date);
        assert.equal(formatted_date, false)
    })
});