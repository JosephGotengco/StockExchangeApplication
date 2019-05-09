const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
var should = require('chai').should();
var cheerio = require('cheerio');
var chai = require('chai'), chaiHttp = require('chai-http');
const nock = require('nock');
const MarqueeCurrency = require('../feature_functions/MarqueeCurrency');
var moment = require("moment");

chai.use(chaiHttp);

beforeEach(() => {
    nock('https://api.exchangeratesapi.io')
    .get('/latest?base=USD')
    .reply(200, reg_mock_data.mock_data);
});

var yesterday = moment().subtract(2, 'days');
var date = yesterday.format('YYYY-MM-DD');

beforeEach(() => {
    nock('https://api.exchangeratesapi.io')
    .get(`/${date}?base=USD`)
    .reply(200, reg_mock_data.yest_mock_data);
});


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





beforeEach(() => {
    nock('https://api.exchangeratesapi.io')
    .get('/latest?base=USD')
    .reply(200, red_mock_data.mock_data);
});

var yesterday = moment().subtract(2, 'days');
var date = yesterday.format('YYYY-MM-DD');

beforeEach(() => {
    nock('https://api.exchangeratesapi.io')
    .get(`/${date}?base=USD`)
    .reply(200, red_mock_data.yest_mock_data);
});


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
            assert.equal(bgn_data.img, '../images/redtriangle.png');

            var eur_data = response[2];
            assert.equal(eur_data.code, 'EUR');
            assert.equal(eur_data.price, '0.89');
            assert.equal(eur_data.img, '../images/redtriangle.png');

            var jpy_data = response[3];
            assert.equal(jpy_data.code, 'JPY');
            assert.equal(jpy_data.price, '111.37');
            assert.equal(jpy_data.img, '../images/redtriangle.png');

            var aud_data = response[4];
            assert.equal(aud_data.code, 'AUD');
            assert.equal(aud_data.price, '1.42');
            assert.equal(aud_data.img, '../images/redtriangle.png');

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
            assert.equal(cny_data.img, '../images/redtriangle.png');

            done()
        }
        callFunc()
    });
});






beforeEach(() => {
    nock('https://api.exchangeratesapi.io')
    .get('/latest?base=USD')
    .reply(200, green_mock_data.mock_data);
});

var yesterday = moment().subtract(2, 'days');
var date = yesterday.format('YYYY-MM-DD');

beforeEach(() => {
    nock('https://api.exchangeratesapi.io')
    .get(`/${date}?base=USD`)
    .reply(200, green_mock_data.yest_mock_data);
});


describe('getMarqueeCurrency function tests', function () {
    it("should return data of ten currencies in array of objects", function (done) {
        var callFunc = async() => {
            var response = await MarqueeCurrency.getMarqueeCurrency()
            // console.log(response)
            var cad_data = response[0];
            assert.equal(cad_data.code, 'CAD');
            assert.equal(cad_data.price, '1.34');
            assert.equal(cad_data.img, '../images/greentriangle.png');
            
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
            assert.equal(hkd_data.price, '7.85');
            assert.equal(hkd_data.img, '../images/greentriangle.png');

            var gbp_data = response[6];
            assert.equal(gbp_data.code, 'GBP');
            assert.equal(gbp_data.price, '0.77');
            assert.equal(gbp_data.img, '../images/greentriangle.png');

            var mxn_data = response[7];
            assert.equal(mxn_data.code, 'MXN');
            assert.equal(mxn_data.price, '18.97');
            assert.equal(mxn_data.img, '../images/greentriangle.png');

            var inr_data = response[8];
            assert.equal(inr_data.code, 'INR');
            assert.equal(inr_data.price, '69.59');
            assert.equal(inr_data.img, '../images/greentriangle.png');

            var cny_data = response[9];
            assert.equal(cny_data.code, 'CNY');
            assert.equal(cny_data.price, '6.73');
            assert.equal(cny_data.img, '../images/greentriangle.png');

            done()
        }
        callFunc()
    });
});





var reg_mock_data = {
    yest_mock_data: {
        "base": "USD",
        "rates": {
            "BGN": 1.74344803,
            "NZD": 1.4980388661,
            "ILS": 3.6056338028,
            "RUB": 64.3696737386,
            "CAD": 1.3438224282,
            "USD": 1.0,
            "PHP": 51.8140488501,
            "CHF": 1.0195221965,
            "AUD": 1.4183455161,
            "JPY": 111.3656623284,
            "TRY": 5.9647887324,
            "HKD": 7.845159565,
            "MYR": 4.1285434124,
            "HRK": 6.6081297914,
            "CZK": 22.8730611517,
            "IDR": 14221.5011588518,
            "DKK": 6.6541272954,
            "NOK": 8.6181137458,
            "HUF": 287.9033695846,
            "GBP": 0.7688357996,
            "MXN": 18.9720984133,
            "THB": 31.9147798181,
            "ISK": 121.4120164022,
            "ZAR": 14.2827598502,
            "BRL": 3.9267249064,
            "SGD": 1.3605812088,
            "PLN": 3.8213585309,
            "INR": 69.5859333214,
            "KRW": 1165.9921554644,
            "RON": 4.2428240328,
            "CNY": 6.7339097878,
            "SEK": 9.4802995186,
            "EUR": 0.8914244963
        },
        "date": "2019-04-30"
    },
    mock_data: {
        "base": "USD",
        "rates": {
            "BGN": 1.7443810203,
            "NZD": 1.508740635,
            "ILS": 3.5975740278,
            "RUB": 65.334909026,
            "CAD": 1.3435604709,
            "USD": 1.0,
            "PHP": 51.7508027114,
            "CHF": 1.0184623618,
            "AUD": 1.4243667499,
            "JPY": 111.4966107742,
            "TRY": 5.9643239386,
            "HKD": 7.8449875134,
            "MYR": 4.1369960756,
            "HRK": 6.6128255441,
            "CZK": 22.8754905458,
            "IDR": 14250.0,
            "DKK": 6.6584909026,
            "NOK": 8.6915804495,
            "HUF": 288.9760970389,
            "GBP": 0.7664109882,
            "MXN": 18.9499643239,
            "THB": 32.0246164823,
            "ISK": 122.5472707813,
            "ZAR": 14.4646806993,
            "BRL": 3.9328398145,
            "SGD": 1.3609525508,
            "PLN": 3.8173385658,
            "INR": 69.3738851231,
            "KRW": 1163.1733856582,
            "RON": 4.2439350696,
            "CNY": 6.7345701035,
            "SEK": 9.5299678915,
            "EUR": 0.8919015341
        },
        "date": "2019-05-02"
    }
}


var red_mock_data = {
    yest_mock_data: {
        "base": "USD",
        "rates": {
            "BGN": 1.7443810203,
            "NZD": 1.508740635,
            "ILS": 3.6056338028,
            "RUB": 65.334909026,
            "CAD": 1.3438224282,
            "USD": 1,
            "PHP": 51.8140488501,
            "CHF": 1.0195221965,
            "AUD": 1.4243667499,
            "JPY": 111.4966107742,
            "TRY": 5.9647887324,
            "HKD": 7.845159565,
            "MYR": 4.1369960756,
            "HRK": 6.6128255441,
            "CZK": 22.8754905458,
            "IDR": 14250,
            "DKK": 6.6584909026,
            "NOK": 8.6915804495,
            "HUF": 288.9760970389,
            "GBP": 0.7688357996,
            "MXN": 18.9720984133,
            "THB": 32.0246164823,
            "ISK": 122.5472707813,
            "ZAR": 14.4646806993,
            "BRL": 3.9328398145,
            "SGD": 1.3609525508,
            "PLN": 3.8213585309,
            "INR": 69.5859333214,
            "KRW": 1165.9921554644,
            "RON": 4.2439350696,
            "CNY": 6.7345701035,
            "SEK": 9.5299678915,
            "EUR": 0.8919015341 
        },
        "date": "2019-04-30"
    },
    mock_data: {
        "base": "USD",
        "rates": {
            "BGN": 1.74344803,
            "NZD": 1.4980388661,
            "ILS": 3.5975740278,
            "RUB": 64.3696737386,
            "CAD": 1.3435604709,
            "USD": 1,
            "PHP": 51.7508027114,
            "CHF": 1.0184623618,
            "AUD": 1.4183455161,
            "JPY": 111.3656623284,
            "TRY": 5.9643239386,
            "HKD": 7.8449875134,
            "MYR": 4.1285434124,
            "HRK": 6.6081297914,
            "CZK": 22.8730611517,
            "IDR": 14221.5011588518,
            "DKK": 6.6541272954,
            "NOK": 8.6181137458,
            "HUF": 287.9033695846,
            "GBP": 0.7664109882,
            "MXN": 18.9499643239,
            "THB": 31.9147798181,
            "ISK": 121.4120164022,
            "ZAR": 14.2827598502,
            "BRL": 3.9267249064,
            "SGD": 1.3605812088,
            "PLN": 3.8173385658,
            "INR": 69.3738851231,
            "KRW": 1163.1733856582,
            "RON": 4.2428240328,
            "CNY": 6.7339097878,
            "SEK": 9.4802995186,
            "EUR": 0.8914244963 
        },
        "date": "2019-05-02"
    }
}




var green_mock_data = {
    yest_mock_data: {
        "base": "USD",
        "rates": {
            "BGN": 1.74344803,
            "NZD": 1.4980388661,
            "ILS": 3.5975740278,
            "RUB": 64.3696737386,
            "CAD": 1.3435604709,
            "USD": 1,
            "PHP": 51.7508027114,
            "CHF": 1.0184623618,
            "AUD": 1.4183455161,
            "JPY": 111.3656623284,
            "TRY": 5.9643239386,
            "HKD": 7.8449875134,
            "MYR": 4.1285434124,
            "HRK": 6.6081297914,
            "CZK": 22.8730611517,
            "IDR": 14221.5011588518,
            "DKK": 6.6541272954,
            "NOK": 8.6181137458,
            "HUF": 287.9033695846,
            "GBP": 0.7664109882,
            "MXN": 18.9499643239,
            "THB": 31.9147798181,
            "ISK": 121.4120164022,
            "ZAR": 14.2827598502,
            "BRL": 3.9267249064,
            "SGD": 1.3605812088,
            "PLN": 3.8173385658,
            "INR": 69.3738851231,
            "KRW": 1163.1733856582,
            "RON": 4.2428240328,
            "CNY": 6.7339097878,
            "SEK": 9.4802995186,
            "EUR": 0.8914244963 
        },
        "date": "2019-04-30"
    },
    mock_data: {
        "base": "USD",
        "rates": {
            "BGN": 1.7443810203,
            "NZD": 1.508740635,
            "ILS": 3.6056338028,
            "RUB": 65.334909026,
            "CAD": 1.3438224282,
            "USD": 1,
            "PHP": 51.8140488501,
            "CHF": 1.0195221965,
            "AUD": 1.4243667499,
            "JPY": 111.4966107742,
            "TRY": 5.9647887324,
            "HKD": 7.845159565,
            "MYR": 4.1369960756,
            "HRK": 6.6128255441,
            "CZK": 22.8754905458,
            "IDR": 14250,
            "DKK": 6.6584909026,
            "NOK": 8.6915804495,
            "HUF": 288.9760970389,
            "GBP": 0.7688357996,
            "MXN": 18.9720984133,
            "THB": 32.0246164823,
            "ISK": 122.5472707813,
            "ZAR": 14.4646806993,
            "BRL": 3.9328398145,
            "SGD": 1.3609525508,
            "PLN": 3.8213585309,
            "INR": 69.5859333214,
            "KRW": 1165.9921554644,
            "RON": 4.2439350696,
            "CNY": 6.7345701035,
            "SEK": 9.5299678915,
            "EUR": 0.8919015341 
        },
        "date": "2019-05-02"
    }
}


