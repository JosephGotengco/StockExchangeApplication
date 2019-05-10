const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
var should = require('chai').should();
var cheerio = require('cheerio');
var chai = require('chai'), chaiHttp = require('chai-http');
const nock = require('nock');
const MarqueeStock = require('../feature_functions/MarqueeStock');

chai.use(chaiHttp);

beforeEach(() => {
    // Put the base of the url in nock
    nock('https://ws-api.iextrading.com')
    // Put the end point in the .get()
    .get('/1.0/stock/market/batch?symbols=NFLX,AAPL,TSLA,GOOG,SBUX,FB,BA,BABA,NKE,AMZN&types=chart&range=1m')
  
    // You basically split up the URL so if you combine them it would like look:
    // https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=FB&types=chart&range=1m
  
    // first arg is the status code u return and the second arg is the data 
    .reply(200, reg_mock_data);
  });

describe('getMarqueeStock function tests', function () {
    it("should return data of ten stocks in array of objects", function (done) {
        var callFunc = async() => {
            var response = await MarqueeStock.getMarqueeStock()
            // console.log(response);
            var nflx_data = response[0];
            assert.equal(nflx_data.code, 'NFLX');
            assert.equal(nflx_data.price, '379.06');
            assert.equal(nflx_data.img, '../images/greentriangle.png');
            
            var aapl_data = response[1];
            assert.equal(aapl_data.code, 'AAPL');
            assert.equal(aapl_data.price, '209.15');
            assert.equal(aapl_data.img, '../images/redtriangle.png');

            var tsla_data = response[2];
            assert.equal(tsla_data.code, 'TSLA');
            assert.equal(tsla_data.price, '244.1');
            assert.equal(tsla_data.img, '../images/greentriangle.png');

            var goog_data = response[3];
            assert.equal(goog_data.code, 'GOOG');
            assert.equal(goog_data.price, '1162.61');
            assert.equal(goog_data.img, '../images/redtriangle.png');

            var sbux_data = response[4];
            assert.equal(sbux_data.code, 'SBUX');
            assert.equal(sbux_data.price, '77.47');
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
            assert.equal(nke_data.price, '85.27');
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


beforeEach(() => {
  // Put the base of the url in nock
  nock('https://ws-api.iextrading.com')
  // Put the end point in the .get()
  .get('/1.0/stock/market/batch?symbols=NFLX,AAPL,TSLA,GOOG,SBUX,FB,BA,BABA,NKE,AMZN&types=chart&range=1m')

  // You basically split up the URL so if you combine them it would like look:
  // https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=FB&types=chart&range=1m

  // first arg is the status code u return and the second arg is the data 
  .reply(200, red_mock_data);
});

describe('getMarqueeStock function tests', function () {
  it("should return data of ten stocks in array of objects", function (done) {
      var callFunc = async() => {
          var response = await MarqueeStock.getMarqueeStock()
          // console.log(response);
          var nflx_data = response[0];
          assert.equal(nflx_data.code, 'NFLX');
          assert.equal(nflx_data.price, '378.81');
          assert.equal(nflx_data.img, '../images/redtriangle.png');
          
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
          assert.equal(sbux_data.price, '77.47');
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
          assert.equal(baba_data.price, '189.31');
          assert.equal(baba_data.img, '../images/redtriangle.png');

          var nke_data = response[8];
          assert.equal(nke_data.code, 'NKE');
          assert.equal(nke_data.price, '85.27');
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


beforeEach(() => {
  // Put the base of the url in nock
  nock('https://ws-api.iextrading.com')
  // Put the end point in the .get()
  .get('/1.0/stock/market/batch?symbols=NFLX,AAPL,TSLA,GOOG,SBUX,FB,BA,BABA,NKE,AMZN&types=chart&range=1m')

  // You basically split up the URL so if you combine them it would like look:
  // https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=FB&types=chart&range=1m

  // first arg is the status code u return and the second arg is the data 
  .reply(200, green_mock_data);
});

describe('getMarqueeStock function tests', function () {
  it("should return data of ten stocks in array of objects", function (done) {
      var callFunc = async() => {
          var response = await MarqueeStock.getMarqueeStock()
          // console.log(response);
          var nflx_data = response[0];
          assert.equal(nflx_data.code, 'NFLX');
          assert.equal(nflx_data.price, '379.06');
          assert.equal(nflx_data.img, '../images/greentriangle.png');
          
          var aapl_data = response[1];
          assert.equal(aapl_data.code, 'AAPL');
          assert.equal(aapl_data.price, '210.52');
          assert.equal(aapl_data.img, '../images/greentriangle.png');

          var tsla_data = response[2];
          assert.equal(tsla_data.code, 'TSLA');
          assert.equal(tsla_data.price, '244.1');
          assert.equal(tsla_data.img, '../images/greentriangle.png');

          var goog_data = response[3];
          assert.equal(goog_data.code, 'GOOG');
          assert.equal(goog_data.price, '1168.08');
          assert.equal(goog_data.img, '../images/greentriangle.png');

          var sbux_data = response[4];
          assert.equal(sbux_data.code, 'SBUX');
          assert.equal(sbux_data.price, '77.52');
          assert.equal(sbux_data.img, '../images/greentriangle.png');

          var fb_data = response[5];
          assert.equal(fb_data.code, 'FB');
          assert.equal(fb_data.price, '193.03');
          assert.equal(fb_data.img, '../images/greentriangle.png');

          var ba_data = response[6];
          assert.equal(ba_data.code, 'BA');
          assert.equal(ba_data.price, '376.8');
          assert.equal(ba_data.img, '../images/greentriangle.png');

          var baba_data = response[7];
          assert.equal(baba_data.code, 'BABA');
          assert.equal(baba_data.price, '190.39');
          assert.equal(baba_data.img, '../images/greentriangle.png');

          var nke_data = response[8];
          assert.equal(nke_data.code, 'NKE');
          assert.equal(nke_data.price, '85.9');
          assert.equal(nke_data.img, '../images/greentriangle.png');

          var amzn_data = response[9];
          assert.equal(amzn_data.code, 'AMZN');
          assert.equal(amzn_data.price, '1911.52');
          assert.equal(amzn_data.img, '../images/greentriangle.png');

          done()
      }
      callFunc()
  });
});











var reg_mock_data = {
  "NFLX": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 374,
        "high": 385.99,
        "low": 373.1746,
        "close": 378.81,
        "volume": 9257284,
        "unadjustedVolume": 9257284,
        "change": 8.27,
        "changePercent": 2.232,
        "vwap": 381.3765,
        "label": "May 1",
        "changeOverTime": 0.06240183980255777
      },
      {
        "date": "2019-05-02",
        "open": 378,
        "high": 383.5,
        "low": 374.51,
        "close": 379.06,
        "volume": 5398167,
        "unadjustedVolume": 5398167,
        "change": 0.25,
        "changePercent": 0.066,
        "vwap": 378.6371,
        "label": "May 2",
        "changeOverTime": 0.06310298407000224
      }
    ]
  },
  "AAPL": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 209.88,
        "high": 215.31,
        "low": 209.23,
        "close": 210.52,
        "volume": 64827328,
        "unadjustedVolume": 64827328,
        "change": 9.85,
        "changePercent": 4.909,
        "vwap": 212.7216,
        "label": "May 1",
        "changeOverTime": 0.10829165569886824
      },
      {
        "date": "2019-05-02",
        "open": 209.84,
        "high": 212.65,
        "low": 208.13,
        "close": 209.15,
        "volume": 31996324,
        "unadjustedVolume": 31996324,
        "change": -1.37,
        "changePercent": -0.651,
        "vwap": 210.2061,
        "label": "May 2",
        "changeOverTime": 0.10107923137667817
      }
    ]
  },
  "TSLA": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 238.85,
        "high": 240,
        "low": 231.5,
        "close": 234.01,
        "volume": 10704354,
        "unadjustedVolume": 10704354,
        "change": -4.68,
        "changePercent": -1.961,
        "vwap": 234.5726,
        "label": "May 1",
        "changeOverTime": -0.16383191595797905
      },
      {
        "date": "2019-05-02",
        "open": 245.52,
        "high": 247.13,
        "low": 237.72,
        "close": 244.1,
        "volume": 18159339,
        "unadjustedVolume": 18159339,
        "change": 10.09,
        "changePercent": 4.312,
        "vwap": 242.4752,
        "label": "May 2",
        "changeOverTime": -0.12777817480168663
      }
    ]
  },
  "GOOG": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 1188.05,
        "high": 1188.05,
        "low": 1167.18,
        "close": 1168.08,
        "volume": 2642983,
        "unadjustedVolume": 2642983,
        "change": -20.4,
        "changePercent": -1.716,
        "vwap": 1175.04,
        "label": "May 1",
        "changeOverTime": -0.00445747500660526
      },
      {
        "date": "2019-05-02",
        "open": 1167.76,
        "high": 1174.19,
        "low": 1155,
        "close": 1162.61,
        "volume": 1944817,
        "unadjustedVolume": 1944817,
        "change": -5.47,
        "changePercent": -0.468,
        "vwap": 1162.6,
        "label": "May 2",
        "changeOverTime": -0.009119499535502165
      }
    ]
  },
  "SBUX": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 77.67,
        "high": 78.15,
        "low": 77.37,
        "close": 77.52,
        "volume": 6678194,
        "unadjustedVolume": 6678194,
        "change": -0.16,
        "changePercent": -0.206,
        "vwap": 77.6881,
        "label": "May 1",
        "changeOverTime": 0.04277643260694098
      },
      {
        "date": "2019-05-02",
        "open": 77.66,
        "high": 77.76,
        "low": 76.75,
        "close": 77.47,
        "volume": 6247550,
        "unadjustedVolume": 6247550,
        "change": -0.05,
        "changePercent": -0.064,
        "vwap": 77.2603,
        "label": "May 2",
        "changeOverTime": 0.04210384718859289
      }
    ]
  },
  "FB": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 194.78,
        "high": 196.1769,
        "low": 193.01,
        "close": 193.03,
        "volume": 15996646,
        "unadjustedVolume": 15996646,
        "change": -0.37,
        "changePercent": -0.191,
        "vwap": 194.5946,
        "label": "May 1",
        "changeOverTime": 0.15801787749715043
      },
      {
        "date": "2019-05-02",
        "open": 193,
        "high": 194,
        "low": 189.75,
        "close": 192.53,
        "volume": 13209452,
        "unadjustedVolume": 13209452,
        "change": -0.5,
        "changePercent": -0.259,
        "vwap": 191.9705,
        "label": "May 2",
        "changeOverTime": 0.15501829743835865
      }
    ]
  },
  "BA": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 378.53,
        "high": 381.1951,
        "low": 376.38,
        "close": 376.8,
        "volume": 2765572,
        "unadjustedVolume": 2765572,
        "change": -0.89,
        "changePercent": -0.236,
        "vwap": 379.0197,
        "label": "May 1",
        "changeOverTime": -0.012112631744533597
      },
      {
        "date": "2019-05-02",
        "open": 375.5,
        "high": 377.65,
        "low": 373.25,
        "close": 375.8,
        "volume": 2438759,
        "unadjustedVolume": 2438759,
        "change": -1,
        "changePercent": -0.265,
        "vwap": 375.1206,
        "label": "May 2",
        "changeOverTime": -0.014734413507419653
      }
    ]
  },
  "BABA": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 186.75,
        "high": 193.195,
        "low": 185.88,
        "close": 189.31,
        "volume": 17405482,
        "unadjustedVolume": 17405482,
        "change": 3.74,
        "changePercent": 2.015,
        "vwap": 190.1792,
        "label": "May 1",
        "changeOverTime": 0.037599342285557766
      },
      {
        "date": "2019-05-02",
        "open": 189.42,
        "high": 192.7,
        "low": 186.65,
        "close": 190.39,
        "volume": 11468106,
        "unadjustedVolume": 11468106,
        "change": 1.08,
        "changePercent": 0.57,
        "vwap": 189.9392,
        "label": "May 2",
        "changeOverTime": 0.043518772266374336
      }
    ]
  },
  "NKE": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 87.73,
        "high": 87.95,
        "low": 85.87,
        "close": 85.9,
        "volume": 6524576,
        "unadjustedVolume": 6524576,
        "change": -1.93,
        "changePercent": -2.197,
        "vwap": 86.7088,
        "label": "May 1",
        "changeOverTime": 0.020068875430471585
      },
      {
        "date": "2019-05-02",
        "open": 86.21,
        "high": 86.28,
        "low": 84.985,
        "close": 85.27,
        "volume": 6813740,
        "unadjustedVolume": 6813740,
        "change": -0.63,
        "changePercent": -0.733,
        "vwap": 85.3986,
        "label": "May 2",
        "changeOverTime": 0.01258757867236673
      }
    ]
  },
  "AMZN": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 1933.09,
        "high": 1943.64,
        "low": 1910.55,
        "close": 1911.52,
        "volume": 3116964,
        "unadjustedVolume": 3116964,
        "change": -15,
        "changePercent": -0.779,
        "vwap": 1931.58,
        "label": "May 1",
        "changeOverTime": 0.07343535027376105
      },
      {
        "date": "2019-05-02",
        "open": 1913.33,
        "high": 1921.55,
        "low": 1881.87,
        "close": 1900.82,
        "volume": 3962915,
        "unadjustedVolume": 3962915,
        "change": -10.7,
        "changePercent": -0.56,
        "vwap": 1899.98,
        "label": "May 2",
        "changeOverTime": 0.0674266460760915
      }
    ]
  }
}




// #---------------------------- RED TRIANGLE MOCK DATA ------------------------------------------# //



var red_mock_data = {
  "NFLX": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 374,
        "high": 385.99,
        "low": 373.1746,
        "close": 379.06,
        "volume": 9257284,
        "unadjustedVolume": 9257284,
        "change": 8.27,
        "changePercent": 2.232,
        "vwap": 381.3765,
        "label": "May 1",
        "changeOverTime": 0.06240183980255777
      },
      {
        "date": "2019-05-02",
        "open": 378,
        "high": 383.5,
        "low": 374.51,
        "close": 378.81,
        "volume": 5398167,
        "unadjustedVolume": 5398167,
        "change": 0.25,
        "changePercent": 0.066,
        "vwap": 378.6371,
        "label": "May 2",
        "changeOverTime": 0.06310298407000224
      }
    ]
  },
  "AAPL": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 209.88,
        "high": 215.31,
        "low": 209.23,
        "close": 210.52,
        "volume": 64827328,
        "unadjustedVolume": 64827328,
        "change": 9.85,
        "changePercent": 4.909,
        "vwap": 212.7216,
        "label": "May 1",
        "changeOverTime": 0.10829165569886824
      },
      {
        "date": "2019-05-02",
        "open": 209.84,
        "high": 212.65,
        "low": 208.13,
        "close": 209.15,
        "volume": 31996324,
        "unadjustedVolume": 31996324,
        "change": -1.37,
        "changePercent": -0.651,
        "vwap": 210.2061,
        "label": "May 2",
        "changeOverTime": 0.10107923137667817
      }
    ]
  },
  "TSLA": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 238.85,
        "high": 240,
        "low": 231.5,
        "close": 244.1,
        "volume": 10704354,
        "unadjustedVolume": 10704354,
        "change": -4.68,
        "changePercent": -1.961,
        "vwap": 234.5726,
        "label": "May 1",
        "changeOverTime": -0.16383191595797905
      },
      {
        "date": "2019-05-02",
        "open": 245.52,
        "high": 247.13,
        "low": 237.72,
        "close": 234.01,
        "volume": 18159339,
        "unadjustedVolume": 18159339,
        "change": 10.09,
        "changePercent": 4.312,
        "vwap": 242.4752,
        "label": "May 2",
        "changeOverTime": -0.12777817480168663
      }
    ]
  },
  "GOOG": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 1188.05,
        "high": 1188.05,
        "low": 1167.18,
        "close": 1168.08,
        "volume": 2642983,
        "unadjustedVolume": 2642983,
        "change": -20.4,
        "changePercent": -1.716,
        "vwap": 1175.04,
        "label": "May 1",
        "changeOverTime": -0.00445747500660526
      },
      {
        "date": "2019-05-02",
        "open": 1167.76,
        "high": 1174.19,
        "low": 1155,
        "close": 1162.61,
        "volume": 1944817,
        "unadjustedVolume": 1944817,
        "change": -5.47,
        "changePercent": -0.468,
        "vwap": 1162.6,
        "label": "May 2",
        "changeOverTime": -0.009119499535502165
      }
    ]
  },
  "SBUX": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 77.67,
        "high": 78.15,
        "low": 77.37,
        "close": 77.52,
        "volume": 6678194,
        "unadjustedVolume": 6678194,
        "change": -0.16,
        "changePercent": -0.206,
        "vwap": 77.6881,
        "label": "May 1",
        "changeOverTime": 0.04277643260694098
      },
      {
        "date": "2019-05-02",
        "open": 77.66,
        "high": 77.76,
        "low": 76.75,
        "close": 77.47,
        "volume": 6247550,
        "unadjustedVolume": 6247550,
        "change": -0.05,
        "changePercent": -0.064,
        "vwap": 77.2603,
        "label": "May 2",
        "changeOverTime": 0.04210384718859289
      }
    ]
  },
  "FB": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 194.78,
        "high": 196.1769,
        "low": 193.01,
        "close": 193.03,
        "volume": 15996646,
        "unadjustedVolume": 15996646,
        "change": -0.37,
        "changePercent": -0.191,
        "vwap": 194.5946,
        "label": "May 1",
        "changeOverTime": 0.15801787749715043
      },
      {
        "date": "2019-05-02",
        "open": 193,
        "high": 194,
        "low": 189.75,
        "close": 192.53,
        "volume": 13209452,
        "unadjustedVolume": 13209452,
        "change": -0.5,
        "changePercent": -0.259,
        "vwap": 191.9705,
        "label": "May 2",
        "changeOverTime": 0.15501829743835865
      }
    ]
  },
  "BA": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 378.53,
        "high": 381.1951,
        "low": 376.38,
        "close": 376.8,
        "volume": 2765572,
        "unadjustedVolume": 2765572,
        "change": -0.89,
        "changePercent": -0.236,
        "vwap": 379.0197,
        "label": "May 1",
        "changeOverTime": -0.012112631744533597
      },
      {
        "date": "2019-05-02",
        "open": 375.5,
        "high": 377.65,
        "low": 373.25,
        "close": 375.8,
        "volume": 2438759,
        "unadjustedVolume": 2438759,
        "change": -1,
        "changePercent": -0.265,
        "vwap": 375.1206,
        "label": "May 2",
        "changeOverTime": -0.014734413507419653
      }
    ]
  },
  "BABA": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 186.75,
        "high": 193.195,
        "low": 185.88,
        "close": 190.39,
        "volume": 17405482,
        "unadjustedVolume": 17405482,
        "change": 3.74,
        "changePercent": 2.015,
        "vwap": 190.1792,
        "label": "May 1",
        "changeOverTime": 0.037599342285557766
      },
      {
        "date": "2019-05-02",
        "open": 189.42,
        "high": 192.7,
        "low": 186.65,
        "close": 189.31,
        "volume": 11468106,
        "unadjustedVolume": 11468106,
        "change": 1.08,
        "changePercent": 0.57,
        "vwap": 189.9392,
        "label": "May 2",
        "changeOverTime": 0.043518772266374336
      }
    ]
  },
  "NKE": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 87.73,
        "high": 87.95,
        "low": 85.87,
        "close": 85.9,
        "volume": 6524576,
        "unadjustedVolume": 6524576,
        "change": -1.93,
        "changePercent": -2.197,
        "vwap": 86.7088,
        "label": "May 1",
        "changeOverTime": 0.020068875430471585
      },
      {
        "date": "2019-05-02",
        "open": 86.21,
        "high": 86.28,
        "low": 84.985,
        "close": 85.27,
        "volume": 6813740,
        "unadjustedVolume": 6813740,
        "change": -0.63,
        "changePercent": -0.733,
        "vwap": 85.3986,
        "label": "May 2",
        "changeOverTime": 0.01258757867236673
      }
    ]
  },
  "AMZN": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 1933.09,
        "high": 1943.64,
        "low": 1910.55,
        "close": 1911.52,
        "volume": 3116964,
        "unadjustedVolume": 3116964,
        "change": -15,
        "changePercent": -0.779,
        "vwap": 1931.58,
        "label": "May 1",
        "changeOverTime": 0.07343535027376105
      },
      {
        "date": "2019-05-02",
        "open": 1913.33,
        "high": 1921.55,
        "low": 1881.87,
        "close": 1900.82,
        "volume": 3962915,
        "unadjustedVolume": 3962915,
        "change": -10.7,
        "changePercent": -0.56,
        "vwap": 1899.98,
        "label": "May 2",
        "changeOverTime": 0.0674266460760915
      }
    ]
  }
}






// #---------------------------- GREEN TRIANGLE MOCK DATA ------------------------------------------# //


var green_mock_data = {
  "NFLX": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 374,
        "high": 385.99,
        "low": 373.1746,
        "volume": 9257284,
        "close": 378.81,
        "unadjustedVolume": 9257284,
        "change": 8.27,
        "changePercent": 2.232,
        "vwap": 381.3765,
        "label": "May 1",
        "changeOverTime": 0.06240183980255777
      },
      {
        "date": "2019-05-02",
        "open": 378,
        "high": 383.5,
        "low": 374.51,
        "close": 379.06,
        "volume": 5398167,
        "unadjustedVolume": 5398167,
        "change": 0.25,
        "changePercent": 0.066,
        "vwap": 378.6371,
        "label": "May 2",
        "changeOverTime": 0.06310298407000224
      }
    ]
  },
  "AAPL": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 209.88,
        "high": 215.31,
        "low": 209.23,
        "close": 209.15,
        "volume": 64827328,
        "unadjustedVolume": 64827328,
        "change": 9.85,
        "changePercent": 4.909,
        "vwap": 212.7216,
        "label": "May 1",
        "changeOverTime": 0.10829165569886824
      },
      {
        "date": "2019-05-02",
        "open": 209.84,
        "high": 212.65,
        "low": 208.13,
        "close": 210.52,
        "volume": 31996324,
        "unadjustedVolume": 31996324,
        "change": -1.37,
        "changePercent": -0.651,
        "vwap": 210.2061,
        "label": "May 2",
        "changeOverTime": 0.10107923137667817
      }
    ]
  },
  "TSLA": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 238.85,
        "high": 240,
        "low": 231.5,
        "close": 234.01,
        "volume": 10704354,
        "unadjustedVolume": 10704354,
        "change": -4.68,
        "changePercent": -1.961,
        "vwap": 234.5726,
        "label": "May 1",
        "changeOverTime": -0.16383191595797905
      },
      {
        "date": "2019-05-02",
        "open": 245.52,
        "high": 247.13,
        "low": 237.72,
        "close": 244.1,
        "volume": 18159339,
        "unadjustedVolume": 18159339,
        "change": 10.09,
        "changePercent": 4.312,
        "vwap": 242.4752,
        "label": "May 2",
        "changeOverTime": -0.12777817480168663
      }
    ]
  },
  "GOOG": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 1188.05,
        "high": 1188.05,
        "low": 1167.18,
        "close": 1162.61,
        "volume": 2642983,
        "unadjustedVolume": 2642983,
        "change": -20.4,
        "changePercent": -1.716,
        "vwap": 1175.04,
        "label": "May 1",
        "changeOverTime": -0.00445747500660526
      },
      {
        "date": "2019-05-02",
        "open": 1167.76,
        "high": 1174.19,
        "low": 1155,
        "close": 1168.08,
        "volume": 1944817,
        "unadjustedVolume": 1944817,
        "change": -5.47,
        "changePercent": -0.468,
        "vwap": 1162.6,
        "label": "May 2",
        "changeOverTime": -0.009119499535502165
      }
    ]
  },
  "SBUX": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 77.67,
        "high": 78.15,
        "low": 77.37,
        "close": 77.47,
        "volume": 6678194,
        "unadjustedVolume": 6678194,
        "change": -0.16,
        "changePercent": -0.206,
        "vwap": 77.6881,
        "label": "May 1",
        "changeOverTime": 0.04277643260694098
      },
      {
        "date": "2019-05-02",
        "open": 77.66,
        "high": 77.76,
        "low": 76.75,
        "close": 77.52,
        "volume": 6247550,
        "unadjustedVolume": 6247550,
        "change": -0.05,
        "changePercent": -0.064,
        "vwap": 77.2603,
        "label": "May 2",
        "changeOverTime": 0.04210384718859289
      }
    ]
  },
  "FB": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 194.78,
        "high": 196.1769,
        "low": 193.01,
        "close": 192.53,
        "volume": 15996646,
        "unadjustedVolume": 15996646,
        "change": -0.37,
        "changePercent": -0.191,
        "vwap": 194.5946,
        "label": "May 1",
        "changeOverTime": 0.15801787749715043
      },
      {
        "date": "2019-05-02",
        "open": 193,
        "high": 194,
        "low": 189.75,
        "close": 193.03,
        "volume": 13209452,
        "unadjustedVolume": 13209452,
        "change": -0.5,
        "changePercent": -0.259,
        "vwap": 191.9705,
        "label": "May 2",
        "changeOverTime": 0.15501829743835865
      }
    ]
  },
  "BA": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 378.53,
        "high": 381.1951,
        "low": 376.38,
        "close": 375.8,
        "volume": 2765572,
        "unadjustedVolume": 2765572,
        "change": -0.89,
        "changePercent": -0.236,
        "vwap": 379.0197,
        "label": "May 1",
        "changeOverTime": -0.012112631744533597
      },
      {
        "date": "2019-05-02",
        "open": 375.5,
        "high": 377.65,
        "low": 373.25,
        "close": 376.8,
        "volume": 2438759,
        "unadjustedVolume": 2438759,
        "change": -1,
        "changePercent": -0.265,
        "vwap": 375.1206,
        "label": "May 2",
        "changeOverTime": -0.014734413507419653
      }
    ]
  },
  "BABA": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 186.75,
        "high": 193.195,
        "low": 185.88,
        "close": 189.31,
        "volume": 17405482,
        "unadjustedVolume": 17405482,
        "change": 3.74,
        "changePercent": 2.015,
        "vwap": 190.1792,
        "label": "May 1",
        "changeOverTime": 0.037599342285557766
      },
      {
        "date": "2019-05-02",
        "open": 189.42,
        "high": 192.7,
        "low": 186.65,
        "close": 190.39,
        "volume": 11468106,
        "unadjustedVolume": 11468106,
        "change": 1.08,
        "changePercent": 0.57,
        "vwap": 189.9392,
        "label": "May 2",
        "changeOverTime": 0.043518772266374336
      }
    ]
  },
  "NKE": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 87.73,
        "high": 87.95,
        "low": 85.87,
        "close": 85.27,
        "volume": 6524576,
        "unadjustedVolume": 6524576,
        "change": -1.93,
        "changePercent": -2.197,
        "vwap": 86.7088,
        "label": "May 1",
        "changeOverTime": 0.020068875430471585
      },
      {
        "date": "2019-05-02",
        "open": 86.21,
        "high": 86.28,
        "low": 84.985,
        "close": 85.9,
        "volume": 6813740,
        "unadjustedVolume": 6813740,
        "change": -0.63,
        "changePercent": -0.733,
        "vwap": 85.3986,
        "label": "May 2",
        "changeOverTime": 0.01258757867236673
      }
    ]
  },
  "AMZN": {
    "chart": [
      {
        "date": "2019-05-01",
        "open": 1933.09,
        "high": 1943.64,
        "low": 1910.55,
        "close": 1900.82,
        "volume": 3116964,
        "unadjustedVolume": 3116964,
        "change": -15,
        "changePercent": -0.779,
        "vwap": 1931.58,
        "label": "May 1",
        "changeOverTime": 0.07343535027376105
      },
      {
        "date": "2019-05-02",
        "open": 1913.33,
        "high": 1921.55,
        "low": 1881.87,
        "close": 1911.52,
        "volume": 3962915,
        "unadjustedVolume": 3962915,
        "change": -10.7,
        "changePercent": -0.56,
        "vwap": 1899.98,
        "label": "May 2",
        "changeOverTime": 0.0674266460760915
      }
    ]
  }
}

