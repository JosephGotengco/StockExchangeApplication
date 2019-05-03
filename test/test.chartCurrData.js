const assert = require('chai').assert;
var chartCurrData = require('../feature_functions/chartCurrData');
const nock = require('nock');
var moment = require("moment");
var formatDate = require('../feature_functions/formatDate')
describe('chartCurrData function tests', function () {

      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      var lastDay = moment().subtract(30, 'days');
      var formatted_firstDay = formatDate.formatDate(firstDay);
      var formatted_lastDay = formatDate.formatDate(lastDay);

    beforeEach(() => {
        nock('https://api.exchangeratesapi.io')
        .get(`/history?start_at=${formatted_lastDay}&end_at=${formatted_firstDay}&symbols=CAD&base=USD`)
        .reply(200, mock_data);
    });

    it("should return object of two arrays with 20 keys/values", function (done) {
        var callFunc = async() => {
            var currency_code = "CAD"
            var response = await chartCurrData.getCurrData(currency_code);
            var label_length = Object.keys(response).length;
            assert.equal(label_length, 20);
            var data_length = Object.values(response).length;
            assert.equal(data_length, 20);
            done()
        }
        callFunc()
    });

    it("should return object of two arrays with 20 keys/values and keys must be ordered", function (done) {
      var callFunc = async() => {
          var currency_code = "CAD"
          var response = await chartCurrData.getCurrData(currency_code);
          // console.log(response);
          var labels = Object.keys(response);
          var label_length = labels.length;
          assert.equal(label_length, 20);


          sorted_labels = labels.sort(function (a, b) {
            return (parseInt(Object.keys(a)[0].slice(-2)) - parseInt(Object.keys(b)[0].slice(-2)));
          });

          assert.equal(sorted_labels, labels);

          var data_length = Object.values(response).length;
          assert.equal(data_length, 20);
          done()
      }
      callFunc()
    });

    beforeEach(() => {
        nock('https://api.exchangeratesapi.io')
        .get('/history?start_at=2019-04-01&end_at=2019-05-01&symbols=UNKNOWN-CURRENCY&base=USD')
        .reply(400, {
            "error": "Symbols 'UNKNOWN' are invalid."
          });
    });

    it("should return false", function (done) {
        var callFunc = async() => {
            var currency_code = "unknown-currency";
            var response = await chartCurrData.getCurrData(currency_code);
            // console.log(response)
            assert.equal(response, false);
            done();
        }
        callFunc();
    });

    it("should return false", function (done) {
      var callFunc = async() => {
        var currency_code = 1;
        var response = await chartCurrData.getCurrData(currency_code);
        assert.equal(response, false);
        done();
      }
      callFunc();
    })

    it("should return false", function (done) {
      var callFunc = async() => {
        var currency_code = 1.1;
        var response = await chartCurrData.getCurrData(currency_code);
        assert.equal(response, false);
        done();
      }
      callFunc();
    })

    it("should return false", function (done) {
      var callFunc = async() => {
        var currency_code = [];
        var response = await chartCurrData.getCurrData(currency_code);
        assert.equal(response, false);
        done();
      }
      callFunc();
    })

    it("should return false", function (done) {
      var callFunc = async() => {
        var currency_code = {};
        var response = await chartCurrData.getCurrData(currency_code);
        assert.equal(response, false);
        done();
      }
      callFunc();
    })
  });


  const mock_data = {
    "base": "USD",
    "rates": {
      "2019-04-24": {
        "CAD": 1.3451690606
      },
      "2019-04-25": {
        "CAD": 1.3506248314
      },
      "2019-04-05": {
        "CAD": 1.3380218998
      },
      "2019-04-01": {
        "CAD": 1.3355286579
      },
      "2019-04-03": {
        "CAD": 1.3309614871
      },
      "2019-04-30": {
        "CAD": 1.3438224282
      },
      "2019-04-15": {
        "CAD": 1.3312118801
      },
      "2019-04-10": {
        "CAD": 1.3327422644
      },
      "2019-04-26": {
        "CAD": 1.3491421899
      },
      "2019-04-17": {
        "CAD": 1.3335103088
      },
      "2019-04-11": {
        "CAD": 1.3376242898
      },
      "2019-04-18": {
        "CAD": 1.3391111111
      },
      "2019-04-23": {
        "CAD": 1.3389951089
      },
      "2019-04-02": {
        "CAD": 1.3320535714
      },
      "2019-04-16": {
        "CAD": 1.336576736
      },
      "2019-04-12": {
        "CAD": 1.3322144687
      },
      "2019-04-29": {
        "CAD": 1.3478026906
      },
      "2019-04-04": {
        "CAD": 1.3358588109
      },
      "2019-04-09": {
        "CAD": 1.3287221779
      },
      "2019-04-08": {
        "CAD": 1.3375422372
      }
    },
    "end_at": "2019-05-01",
    "start_at": "2019-04-01"
  }
  
