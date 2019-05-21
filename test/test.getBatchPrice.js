const assert = require('chai').assert;
const nock = require('nock');
var getBatchPrice = require("../feature_functions/getBatchPrice");

beforeEach(() => {
    nock('https://ws-api.iextrading.com')
        .get(`/1.0/stock/market/batch?symbols=FB,SNAP,&types=chart&range=1m&last=5`)
        .reply(200, mock_data);
});
        
beforeEach(() => {
    nock('https://ws-api.iextrading.com')
        .get(`/1.0/stock/market/batch?symbols=FB,SNAP,AAPL,&types=chart&range=1m&last=5`)
        // no reply
    });

describe('getBatchPrice function tests', () => {
    it("should return closing prices of data", async () => {
        var tickers = "FB,SNAP,"
        var result = await getBatchPrice.getBatchClosePrice(tickers);
        var expected = { FB: 185.3, SNAP: 11.49 };
        var expected_FB = expected["FB"];
        var expected_SNAP = expected["SNAP"];
        
        var actual_FB = result["FB"];
        var actual_SNAP = result["SNAP"];

        assert.equal(actual_FB, expected_FB);
        assert.equal(actual_SNAP, expected_SNAP);
    });


    it("should pass wrong argument type", async () => {
        var tickers = 1;
        var result = await getBatchPrice.getBatchClosePrice(tickers);
        assert.isFalse(result);
    });



    it("should get no reply", async() => {
        var tickers = "FB,SNAP,AAPL,";
        var result = await getBatchPrice.getBatchClosePrice(tickers);
        assert.isFalse(result);
    });
});

var mock_data = {
    "FB": {
        "chart": [
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
                "changeOverTime": 0
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
                "changeOverTime": -0.004341775674923469
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
                "changeOverTime": -0.00484274979126081
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
                "changeOverTime": -0.007625939326468157
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
                "changeOverTime": 0.00996381853604226
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
                "changeOverTime": 0.022989145560812666
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
                "changeOverTime": 0.016309490676315094
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
                "changeOverTime": 0.07575841914834391
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
                "changeOverTime": 0.06590592819371001
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
                "changeOverTime": 0.08421931533537431
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
                "changeOverTime": 0.07653771221820206
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
                "changeOverTime": 0.07447815196214859
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
                "changeOverTime": 0.07169496242694125
            },
            {
                "date": "2019-05-03",
                "open": 194.38,
                "high": 196.16,
                "low": 193.71,
                "close": 195.47,
                "volume": 14575434,
                "unadjustedVolume": 14575434,
                "change": 2.94,
                "changePercent": 1.527,
                "vwap": 195.3307,
                "label": "May 3",
                "changeOverTime": 0.08806011689396044
            },
            {
                "date": "2019-05-06",
                "open": 191.24,
                "high": 194.28,
                "low": 190.55,
                "close": 193.88,
                "volume": 13994932,
                "unadjustedVolume": 13994932,
                "change": -1.59,
                "changePercent": -0.813,
                "vwap": 193.0681,
                "label": "May 6",
                "changeOverTime": 0.07920957417200106
            },
            {
                "date": "2019-05-07",
                "open": 192.54,
                "high": 192.9,
                "low": 187.85,
                "close": 189.77,
                "volume": 16253001,
                "unadjustedVolume": 16253001,
                "change": -4.11,
                "changePercent": -2.12,
                "vwap": 189.8775,
                "label": "May 7",
                "changeOverTime": 0.05633175619259674
            },
            {
                "date": "2019-05-08",
                "open": 189.39,
                "high": 190.72,
                "low": 188.55,
                "close": 189.54,
                "volume": 12505737,
                "unadjustedVolume": 12505737,
                "change": -0.23,
                "changePercent": -0.121,
                "vwap": 189.6896,
                "label": "May 8",
                "changeOverTime": 0.05505148900640126
            },
            {
                "date": "2019-05-09",
                "open": 187.2,
                "high": 189.77,
                "low": 186.26,
                "close": 188.65,
                "volume": 12967033,
                "unadjustedVolume": 12967033,
                "change": -0.89,
                "changePercent": -0.47,
                "vwap": 188.1,
                "label": "May 9",
                "changeOverTime": 0.050097411633732256
            },
            {
                "date": "2019-05-10",
                "open": 188.25,
                "high": 190,
                "low": 184.59,
                "close": 188.34,
                "volume": 12578508,
                "unadjustedVolume": 12578508,
                "change": -0.31,
                "changePercent": -0.164,
                "vwap": 187.1421,
                "label": "May 10",
                "changeOverTime": 0.048371834121903684
            },
            {
                "date": "2019-05-13",
                "open": 183.5,
                "high": 185.43,
                "low": 180.84,
                "close": 181.54,
                "volume": 16833347,
                "unadjustedVolume": 16833347,
                "change": -6.8,
                "changePercent": -3.61,
                "vwap": 182.8072,
                "label": "May 13",
                "changeOverTime": 0.010520456443083697
            },
            {
                "date": "2019-05-14",
                "open": 182.52,
                "high": 183.49,
                "low": 178.1,
                "close": 180.73,
                "volume": 17628142,
                "unadjustedVolume": 17628142,
                "change": -0.81,
                "changePercent": -0.446,
                "vwap": 180.8468,
                "label": "May 14",
                "changeOverTime": 0.006011689396047782
            },
            {
                "date": "2019-05-15",
                "open": 180.42,
                "high": 187.28,
                "low": 180.02,
                "close": 186.27,
                "volume": 16746904,
                "unadjustedVolume": 16746904,
                "change": 5.54,
                "changePercent": 3.065,
                "vwap": 185.2815,
                "label": "May 15",
                "changeOverTime": 0.036849429446145304
            },
            {
                "date": "2019-05-16",
                "open": 185.05,
                "high": 188.575,
                "low": 185.05,
                "close": 186.99,
                "volume": 12953111,
                "unadjustedVolume": 12953111,
                "change": 0.72,
                "changePercent": 0.387,
                "vwap": 187.1371,
                "label": "May 16",
                "changeOverTime": 0.04085722237684388
            },
            {
                "date": "2019-05-17",
                "open": 184.84,
                "high": 187.58,
                "low": 184.28,
                "close": 185.3,
                "volume": 10485370,
                "unadjustedVolume": 10485370,
                "change": -1.69,
                "changePercent": -0.904,
                "vwap": 185.9239,
                "label": "May 17",
                "changeOverTime": 0.031450041747843056
            }
        ]
    },
    "SNAP": {
        "chart": [
            {
                "date": "2019-04-15",
                "open": 11.9,
                "high": 12.02,
                "low": 11.79,
                "close": 11.85,
                "volume": 10578909,
                "unadjustedVolume": 10578909,
                "change": -0.12,
                "changePercent": -1.003,
                "vwap": 11.8695,
                "label": "Apr 15",
                "changeOverTime": 0
            },
            {
                "date": "2019-04-16",
                "open": 11.8,
                "high": 11.85,
                "low": 11.48,
                "close": 11.69,
                "volume": 19741078,
                "unadjustedVolume": 19741078,
                "change": -0.16,
                "changePercent": -1.35,
                "vwap": 11.6775,
                "label": "Apr 16",
                "changeOverTime": -0.013502109704641363
            },
            {
                "date": "2019-04-17",
                "open": 11.76,
                "high": 11.83,
                "low": 11.52,
                "close": 11.75,
                "volume": 14681621,
                "unadjustedVolume": 14681621,
                "change": 0.06,
                "changePercent": 0.513,
                "vwap": 11.6517,
                "label": "Apr 17",
                "changeOverTime": -0.008438818565400814
            },
            {
                "date": "2019-04-18",
                "open": 11.18,
                "high": 11.71,
                "low": 11.18,
                "close": 11.67,
                "volume": 24285199,
                "unadjustedVolume": 24285199,
                "change": -0.08,
                "changePercent": -0.681,
                "vwap": 11.4841,
                "label": "Apr 18",
                "changeOverTime": -0.015189873417721496
            },
            {
                "date": "2019-04-22",
                "open": 11.55,
                "high": 11.7,
                "low": 11.23,
                "close": 11.53,
                "volume": 20725500,
                "unadjustedVolume": 20725500,
                "change": -0.14,
                "changePercent": -1.2,
                "vwap": 11.4679,
                "label": "Apr 22",
                "changeOverTime": -0.027004219409282725
            },
            {
                "date": "2019-04-23",
                "open": 11.94,
                "high": 12.2,
                "low": 11.6742,
                "close": 11.99,
                "volume": 63113347,
                "unadjustedVolume": 63113347,
                "change": 0.46,
                "changePercent": 3.99,
                "vwap": 11.9925,
                "label": "Apr 23",
                "changeOverTime": 0.01181434599156123
            },
            {
                "date": "2019-04-24",
                "open": 12.35,
                "high": 12.42,
                "low": 11.06,
                "close": 11.26,
                "volume": 106430642,
                "unadjustedVolume": 106430642,
                "change": -0.73,
                "changePercent": -6.088,
                "vwap": 11.3568,
                "label": "Apr 24",
                "changeOverTime": -0.04978902953586497
            },
            {
                "date": "2019-04-25",
                "open": 11.13,
                "high": 11.15,
                "low": 10.51,
                "close": 10.79,
                "volume": 51272563,
                "unadjustedVolume": 51272563,
                "change": -0.47,
                "changePercent": -4.174,
                "vwap": 10.7802,
                "label": "Apr 25",
                "changeOverTime": -0.089451476793249
            },
            {
                "date": "2019-04-26",
                "open": 10.73,
                "high": 11.13,
                "low": 10.69,
                "close": 10.91,
                "volume": 23725546,
                "unadjustedVolume": 23725546,
                "change": 0.12,
                "changePercent": 1.112,
                "vwap": 10.9618,
                "label": "Apr 26",
                "changeOverTime": -0.07932489451476789
            },
            {
                "date": "2019-04-29",
                "open": 11.1,
                "high": 11.29,
                "low": 11.06,
                "close": 11.22,
                "volume": 21473820,
                "unadjustedVolume": 21473820,
                "change": 0.31,
                "changePercent": 2.841,
                "vwap": 11.1894,
                "label": "Apr 29",
                "changeOverTime": -0.05316455696202523
            },
            {
                "date": "2019-04-30",
                "open": 11.16,
                "high": 11.3699,
                "low": 11.02,
                "close": 11.14,
                "volume": 17017903,
                "unadjustedVolume": 17017903,
                "change": -0.08,
                "changePercent": -0.713,
                "vwap": 11.1679,
                "label": "Apr 30",
                "changeOverTime": -0.05991561181434592
            },
            {
                "date": "2019-05-01",
                "open": 11.2,
                "high": 11.36,
                "low": 11.14,
                "close": 11.2,
                "volume": 13589920,
                "unadjustedVolume": 13589920,
                "change": 0.06,
                "changePercent": 0.539,
                "vwap": 11.2456,
                "label": "May 1",
                "changeOverTime": -0.054852320675105516
            },
            {
                "date": "2019-05-02",
                "open": 11.23,
                "high": 11.25,
                "low": 10.99,
                "close": 11.24,
                "volume": 12005039,
                "unadjustedVolume": 12005039,
                "change": 0.04,
                "changePercent": 0.357,
                "vwap": 11.1399,
                "label": "May 2",
                "changeOverTime": -0.0514767932489451
            },
            {
                "date": "2019-05-03",
                "open": 11.2503,
                "high": 11.84,
                "low": 11.2503,
                "close": 11.8,
                "volume": 19211736,
                "unadjustedVolume": 19211736,
                "change": 0.56,
                "changePercent": 4.982,
                "vwap": 11.6335,
                "label": "May 3",
                "changeOverTime": -0.004219409282700332
            },
            {
                "date": "2019-05-06",
                "open": 11.39,
                "high": 11.86,
                "low": 11.38,
                "close": 11.77,
                "volume": 12552518,
                "unadjustedVolume": 12552518,
                "change": -0.03,
                "changePercent": -0.254,
                "vwap": 11.6645,
                "label": "May 6",
                "changeOverTime": -0.006751054852320681
            },
            {
                "date": "2019-05-07",
                "open": 11.66,
                "high": 11.78,
                "low": 11.07,
                "close": 11.17,
                "volume": 20793150,
                "unadjustedVolume": 20793150,
                "change": -0.6,
                "changePercent": -5.098,
                "vwap": 11.3886,
                "label": "May 7",
                "changeOverTime": -0.05738396624472571
            },
            {
                "date": "2019-05-08",
                "open": 11.24,
                "high": 11.2699,
                "low": 10.79,
                "close": 10.82,
                "volume": 21362077,
                "unadjustedVolume": 21362077,
                "change": -0.35,
                "changePercent": -3.133,
                "vwap": 10.9436,
                "label": "May 8",
                "changeOverTime": -0.08691983122362865
            },
            {
                "date": "2019-05-09",
                "open": 10.71,
                "high": 11.1,
                "low": 10.65,
                "close": 10.98,
                "volume": 15840653,
                "unadjustedVolume": 15840653,
                "change": 0.16,
                "changePercent": 1.479,
                "vwap": 10.8993,
                "label": "May 9",
                "changeOverTime": -0.07341772151898728
            },
            {
                "date": "2019-05-10",
                "open": 10.92,
                "high": 10.92,
                "low": 10.28,
                "close": 10.49,
                "volume": 23159715,
                "unadjustedVolume": 23159715,
                "change": -0.49,
                "changePercent": -4.463,
                "vwap": 10.5169,
                "label": "May 10",
                "changeOverTime": -0.11476793248945143
            },
            {
                "date": "2019-05-13",
                "open": 10.05,
                "high": 10.34,
                "low": 10.04,
                "close": 10.11,
                "volume": 15911862,
                "unadjustedVolume": 15911862,
                "change": -0.38,
                "changePercent": -3.622,
                "vwap": 10.1498,
                "label": "May 13",
                "changeOverTime": -0.14683544303797472
            },
            {
                "date": "2019-05-14",
                "open": 10.23,
                "high": 10.65,
                "low": 10.2,
                "close": 10.49,
                "volume": 19956276,
                "unadjustedVolume": 19956276,
                "change": 0.38,
                "changePercent": 3.759,
                "vwap": 10.4759,
                "label": "May 14",
                "changeOverTime": -0.11476793248945143
            },
            {
                "date": "2019-05-15",
                "open": 10.45,
                "high": 10.73,
                "low": 10.4,
                "close": 10.66,
                "volume": 12390524,
                "unadjustedVolume": 12390524,
                "change": 0.17,
                "changePercent": 1.621,
                "vwap": 10.6201,
                "label": "May 15",
                "changeOverTime": -0.10042194092827
            },
            {
                "date": "2019-05-16",
                "open": 10.72,
                "high": 11.54,
                "low": 10.72,
                "close": 11.42,
                "volume": 36343789,
                "unadjustedVolume": 36343789,
                "change": 0.76,
                "changePercent": 7.129,
                "vwap": 11.3545,
                "label": "May 16",
                "changeOverTime": -0.036286919831223605
            },
            {
                "date": "2019-05-17",
                "open": 11.24,
                "high": 11.64,
                "low": 11.09,
                "close": 11.49,
                "volume": 24816973,
                "unadjustedVolume": 24816973,
                "change": 0.07,
                "changePercent": 0.613,
                "vwap": 11.4566,
                "label": "May 17",
                "changeOverTime": -0.03037974683544299
            }
        ]
    }
}