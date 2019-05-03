const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
var should = require('chai').should();
var cheerio = require('cheerio');
var chai = require('chai'), chaiHttp = require('chai-http');
const nock = require('nock');
const MarqueeStock = require('../feature_functions/MarqueeStock');

chai.use(chaiHttp);

describe('getMarqueeStock function tests', function () {
    it("should return data of ten stocks in array of objects", function (done) {
        var callFunc = async() => {
            var response = await MarqueeStock.getMarqueeStock()
            // console.log(response);
            var nflx_data = response[0];
            assert.equal(nflx_data.code, 'NFLX');
            assert.equal(nflx_data.price, '378.81');
            assert.equal(nflx_data.img, '../images/greentriangle.png');
            
            var aapl_data = response[1];
            assert.equal(aapl_data.code, 'AAPL');
            assert.equal(aapl_data.price, '209.15');
            assert.equal(aapl_data.img, '../images/redtriangle.png');

            var tsla_data = response[2];
            assert.equal(tsla_data.code, 'TSLA');
            assert.equal(tsla_data.price, '234.01');
            assert.equal(tsla_data.img, '../images/redtriangle.png');

            var goog_data = response[3];
            assert.equal(goog_data.code, 'GOOG');
            assert.equal(goog_data.price, '1162.61');
            assert.equal(goog_data.img, '../images/redtriangle.png');

            var sbux_data = response[4];
            assert.equal(sbux_data.code, 'SBUX');
            assert.equal(sbux_data.price, '77.52');
            assert.equal(sbux_data.img, '../images/redtriangle.png');

            var fb_data = response[5];
            assert.equal(fb_data.code, 'FB');
            assert.equal(fb_data.price, '192.53');
            assert.equal(fb_data.img, '../images/redtriangle.png');

            var ba_data = response[6];
            assert.equal(ba_data.code, 'BA');
            assert.equal(ba_data.price, '375.8');
            assert.equal(ba_data.img, '../images/redtriangle.png');

            var baba_data = response[7];
            assert.equal(baba_data.code, 'BABA');
            assert.equal(baba_data.price, '190.39');
            assert.equal(baba_data.img, '../images/greentriangle.png');

            var nke_data = response[8];
            assert.equal(nke_data.code, 'NKE');
            assert.equal(nke_data.price, '85.9');
            assert.equal(nke_data.img, '../images/redtriangle.png');

            var amzn_data = response[9];
            assert.equal(amzn_data.code, 'AMZN');
            assert.equal(amzn_data.price, '1900.82');
            assert.equal(amzn_data.img, '../images/redtriangle.png');

            done()
        }
        callFunc()
    });
});