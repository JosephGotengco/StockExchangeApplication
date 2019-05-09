const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
var should = require('chai').should();
var cheerio = require('cheerio');
var chai = require('chai'), chaiHttp = require('chai-http');
const nock = require('nock');
const MarqueeCurrency = require('../feature_functions/MarqueeCurrency');

chai.use(chaiHttp);

describe('getMarqueeCurrency function tests', function () {
    it("should return data of ten currencies in array of objects", function (done) {
        var callFunc = async() => {
            var response = await MarqueeCurrency.getMarqueeCurrency()
            // console.log(response)
            var cad_data = response[0];
            assert.equal(cad_data.code, 'CAD');
            assert.equal(cad_data.price, '1.34');
            assert.equal(cad_data.img, '../images/redtriangle.png');
            
            var bgn_data = response[1];
            assert.equal(bgn_data.code, 'BGN');
            assert.equal(bgn_data.price, '1.74');
            assert.equal(bgn_data.img, '../images/greentriangle.png');

            var eur_data = response[2];
            assert.equal(eur_data.code, 'EUR');
            assert.equal(eur_data.price, '0.89');
            assert.equal(eur_data.img, '../images/greentriangle.png');

            var jpy_data = response[3];
            assert.equal(jpy_data.code, 'JPY');
            assert.equal(jpy_data.price, '111.50');
            assert.equal(jpy_data.img, '../images/greentriangle.png');

            var aud_data = response[4];
            assert.equal(aud_data.code, 'AUD');
            assert.equal(aud_data.price, '1.42');
            assert.equal(aud_data.img, '../images/greentriangle.png');

            var hkd_data = response[5];
            assert.equal(hkd_data.code, 'HKD');
            assert.equal(hkd_data.price, '7.84');
            assert.equal(hkd_data.img, '../images/redtriangle.png');

            var gbp_data = response[6];
            assert.equal(gbp_data.code, 'GBP');
            assert.equal(gbp_data.price, '0.77');
            assert.equal(gbp_data.img, '../images/redtriangle.png');

            var mxn_data = response[7];
            assert.equal(mxn_data.code, 'MXN');
            assert.equal(mxn_data.price, '18.95');
            assert.equal(mxn_data.img, '../images/redtriangle.png');

            var inr_data = response[8];
            assert.equal(inr_data.code, 'INR');
            assert.equal(inr_data.price, '69.37');
            assert.equal(inr_data.img, '../images/redtriangle.png');

            var cny_data = response[9];
            assert.equal(cny_data.code, 'CNY');
            assert.equal(cny_data.price, '6.73');
            assert.equal(cny_data.img, '../images/greentriangle.png');

            done()
        }
        callFunc()
    });
});