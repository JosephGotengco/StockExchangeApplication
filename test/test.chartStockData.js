var chartStockData = require('../feature_functions/chartStockData');
const assert = require('chai').assert;
const nock = require('nock');

describe('Test chart stock data function (chartStockData) ', function () {

                    
    beforeEach(() => {
        // Put the base of the url in nock
        nock('https://ws-api.iextrading.com')
        // Put the end point in the .get()
        .get('/1.0/stock/market/batch?symbols=FB&types=chart&range=1m')

        // You basically split up the URL so if you combine them it would like look:
        // https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=FB&types=chart&range=1m

        // first arg is the status code u return and the second arg is the data 
        .reply(200, mock_data);
    });


    //TESTS



    it("should return a object with 23 keys/values", (done) => {
        var callFunc = async() => {
            var ticker= "FB"
            var response = await chartStockData.getStockData(ticker);
            var labels = Object.keys(response);
            var label_length = labels.length;
            assert.equal(label_length, 23);
            var data = Object.values(response);
            var data_length = data.length;
            assert.equal(data_length, 23);
            done()
        }
        callFunc()
    });

  it("should return false", function (done) {
    var callFunc = async() => {
        var currency_code = "Invalid Currency Code"
        var response = await chartStockData.getStockData(currency_code);
        assert.equal(response, false);
        done()
    }
    callFunc()
  });

  it("should return false", function (done) {
    var callFunc = async() => {
        var currency_code = 1
        var response = await chartStockData.getStockData(currency_code);
        assert.equal(response, false);
        done()
    }
    callFunc()
});

  it("should return false", function (done) {
    var callFunc = async() => {
        var currency_code = 1.1
        var response = await chartStockData.getStockData(currency_code);
        assert.equal(response, false);
        done()
    }
    callFunc()
  });

  it("should return false", function (done) {
    var callFunc = async() => {
        var currency_code = []
        var response = await chartStockData.getStockData(currency_code);
        assert.equal(response, false);
        done()
    }
    callFunc()
  });

  it("should return false", function (done) {
    var callFunc = async() => {
        var currency_code = {}
        var response = await chartStockData.getStockData(currency_code);
        assert.equal(response, false);
        done()
    }
    callFunc()
    });
});


const mock_data = {
    "FB": {
        "chart": [
        {
            "date": "2019-03-29",
            "open": 166.39,
            "high": 167.19,
            "low": 164.81,
            "close": 166.69,
            "volume": 13455454,
            "unadjustedVolume": 13455454,
            "change": 1.14,
            "changePercent": 0.689,
            "vwap": 166.2698,
            "label": "Mar 29",
            "changeOverTime": 0
        },
        {
            "date": "2019-04-01",
            "open": 167.83,
            "high": 168.9,
            "low": 167.2789,
            "close": 168.7,
            "volume": 10381490,
            "unadjustedVolume": 10381490,
            "change": 2.01,
            "changePercent": 1.206,
            "vwap": 168.2703,
            "label": "Apr 1",
            "changeOverTime": 0.012058311836342858
        },
        {
            "date": "2019-04-02",
            "open": 170.14,
            "high": 174.9,
            "low": 169.55,
            "close": 174.2,
            "volume": 23946529,
            "unadjustedVolume": 23946529,
            "change": 5.5,
            "changePercent": 3.26,
            "vwap": 173.2408,
            "label": "Apr 2",
            "changeOverTime": 0.04505369248305232
        },
        {
            "date": "2019-04-03",
            "open": 174.5,
            "high": 177.96,
            "low": 172.95,
            "close": 173.54,
            "volume": 27590058,
            "unadjustedVolume": 27590058,
            "change": -0.66,
            "changePercent": -0.379,
            "vwap": 175.1781,
            "label": "Apr 3",
            "changeOverTime": 0.0410942468054472
        },
        {
            "date": "2019-04-04",
            "open": 176.02,
            "high": 178,
            "low": 175.5301,
            "close": 176.02,
            "volume": 17847731,
            "unadjustedVolume": 17847731,
            "change": 2.48,
            "changePercent": 1.429,
            "vwap": 176.7923,
            "label": "Apr 4",
            "changeOverTime": 0.05597216389705449
        },
        {
            "date": "2019-04-05",
            "open": 176.88,
            "high": 177,
            "low": 175.1,
            "close": 175.72,
            "volume": 9594133,
            "unadjustedVolume": 9594133,
            "change": -0.3,
            "changePercent": -0.17,
            "vwap": 175.7401,
            "label": "Apr 5",
            "changeOverTime": 0.05417241586177936
        },
        {
            "date": "2019-04-08",
            "open": 175.21,
            "high": 175.5,
            "low": 174.23,
            "close": 174.93,
            "volume": 7297379,
            "unadjustedVolume": 7297379,
            "change": -0.79,
            "changePercent": -0.45,
            "vwap": 174.7503,
            "label": "Apr 8",
            "changeOverTime": 0.04943307936888841
        },
        {
            "date": "2019-04-09",
            "open": 175.62,
            "high": 179.19,
            "low": 175.55,
            "close": 177.58,
            "volume": 19751031,
            "unadjustedVolume": 19751031,
            "change": 2.65,
            "changePercent": 1.515,
            "vwap": 177.883,
            "label": "Apr 9",
            "changeOverTime": 0.06533085368048482
        },
        {
            "date": "2019-04-10",
            "open": 178.18,
            "high": 178.79,
            "low": 176.54,
            "close": 177.82,
            "volume": 11701479,
            "unadjustedVolume": 11701479,
            "change": 0.24,
            "changePercent": 0.135,
            "vwap": 177.5232,
            "label": "Apr 10",
            "changeOverTime": 0.06677065210870475
        },
        {
            "date": "2019-04-11",
            "open": 178.24,
            "high": 178.4,
            "low": 177,
            "close": 177.51,
            "volume": 8070967,
            "unadjustedVolume": 8070967,
            "change": -0.31,
            "changePercent": -0.174,
            "vwap": 177.6694,
            "label": "Apr 11",
            "changeOverTime": 0.06491091247225385
        },
        {
            "date": "2019-04-12",
            "open": 178,
            "high": 179.63,
            "low": 177.95,
            "close": 179.1,
            "volume": 12329812,
            "unadjustedVolume": 12329812,
            "change": 1.59,
            "changePercent": 0.896,
            "vwap": 178.9876,
            "label": "Apr 12",
            "changeOverTime": 0.0744495770592117
        },
        {
            "date": "2019-04-15",
            "open": 178.5,
            "high": 180.5,
            "low": 176.87,
            "close": 179.65,
            "volume": 10834762,
            "unadjustedVolume": 10834762,
            "change": 0.55,
            "changePercent": 0.307,
            "vwap": 179.0621,
            "label": "Apr 15",
            "changeOverTime": 0.0777491151238827
        },
        {
            "date": "2019-04-16",
            "open": 179,
            "high": 180.17,
            "low": 178.3,
            "close": 178.87,
            "volume": 11215193,
            "unadjustedVolume": 11215193,
            "change": -0.78,
            "changePercent": -0.434,
            "vwap": 179.3899,
            "label": "Apr 16",
            "changeOverTime": 0.07306977023216754
        },
        {
            "date": "2019-04-17",
            "open": 179.6,
            "high": 180.74,
            "low": 178.36,
            "close": 178.78,
            "volume": 9973732,
            "unadjustedVolume": 9973732,
            "change": -0.09,
            "changePercent": -0.05,
            "vwap": 179.185,
            "label": "Apr 17",
            "changeOverTime": 0.072529845821585
        },
        {
            "date": "2019-04-18",
            "open": 178.8,
            "high": 178.88,
            "low": 177.34,
            "close": 178.28,
            "volume": 11655608,
            "unadjustedVolume": 11655608,
            "change": -0.5,
            "changePercent": -0.28,
            "vwap": 178.1329,
            "label": "Apr 18",
            "changeOverTime": 0.06953026576279323
        },
        {
            "date": "2019-04-22",
            "open": 178.25,
            "high": 181.665,
            "low": 178.25,
            "close": 181.44,
            "volume": 13389889,
            "unadjustedVolume": 13389889,
            "change": 3.16,
            "changePercent": 1.772,
            "vwap": 180.469,
            "label": "Apr 22",
            "changeOverTime": 0.0884876117343572
        },
        {
            "date": "2019-04-23",
            "open": 182.74,
            "high": 184.22,
            "low": 181.48,
            "close": 183.78,
            "volume": 19954814,
            "unadjustedVolume": 19954814,
            "change": 2.34,
            "changePercent": 1.29,
            "vwap": 183.0751,
            "label": "Apr 23",
            "changeOverTime": 0.1025256464095027
        },
        {
            "date": "2019-04-24",
            "open": 184.49,
            "high": 185.14,
            "low": 181.65,
            "close": 182.58,
            "volume": 37289871,
            "unadjustedVolume": 37289871,
            "change": -1.2,
            "changePercent": -0.653,
            "vwap": 183.0402,
            "label": "Apr 24",
            "changeOverTime": 0.09532665426840252
        },
        {
            "date": "2019-04-25",
            "open": 196.98,
            "high": 198.48,
            "low": 192.12,
            "close": 193.26,
            "volume": 54148789,
            "unadjustedVolume": 54148789,
            "change": 10.68,
            "changePercent": 5.849,
            "vwap": 194.5861,
            "label": "Apr 25",
            "changeOverTime": 0.15939768432419457
        },
        {
            "date": "2019-04-26",
            "open": 192.5,
            "high": 192.9,
            "low": 189.09,
            "close": 191.49,
            "volume": 22075002,
            "unadjustedVolume": 22075002,
            "change": -1.77,
            "changePercent": -0.916,
            "vwap": 191.1849,
            "label": "Apr 26",
            "changeOverTime": 0.14877917091607182
        },
        {
            "date": "2019-04-29",
            "open": 190.95,
            "high": 195.41,
            "low": 190.65,
            "close": 194.78,
            "volume": 19641310,
            "unadjustedVolume": 19641310,
            "change": 3.29,
            "changePercent": 1.718,
            "vwap": 194.0134,
            "label": "Apr 29",
            "changeOverTime": 0.16851640770292162
        },
        {
            "date": "2019-04-30",
            "open": 194.19,
            "high": 197.39,
            "low": 192.28,
            "close": 193.4,
            "volume": 23494689,
            "unadjustedVolume": 23494689,
            "change": -1.38,
            "changePercent": -0.708,
            "vwap": 194.6392,
            "label": "Apr 30",
            "changeOverTime": 0.16023756674065637
        },
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
        }
        ]
    }
    }