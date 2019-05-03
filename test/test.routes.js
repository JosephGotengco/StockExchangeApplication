const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
var should = require('chai').should();
var cheerio = require('cheerio');
var chai = require('chai'), chaiHttp = require('chai-http');
const nock = require('nock');
var moment = require("moment");

chai.use(chaiHttp);
const app = require('../project');

beforeEach(() => {
  // Put the base of the url in nock
  nock('https://ws-api.iextrading.com')
  // Put the end point in the .get()
  .get('/1.0/stock/market/batch?symbols=NFLX,AAPL,TSLA,GOOG,SBUX,FB,BA,BABA,NKE,AMZN&types=chart&range=1m')

  // You basically split up the URL so if you combine them it would like look:
  // https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=FB&types=chart&range=1m

  // first arg is the status code u return and the second arg is the data 
  .reply(200, mock_data);
});


beforeEach(() => {
  nock('https://api.exchangeratesapi.io')
  .get('/latest?base=USD')
  .reply(200, exchange_rate_mock_data);
});

var yesterday = moment().subtract(2, 'days');
var date = yesterday.format('YYYY-MM-DD');

beforeEach(() => {
  nock('https://api.exchangeratesapi.io')
  .get(`/${date}?base=USD`)
  .reply(200, yest_exchange_rate_mock_data);
});

describe('GET /unknown-endpoint', function () {
    it("should return webpage with title of 'Sorry the URL \'localhost:8080/unknown-endpoint\' does not exist.' ", function (done) {
        request(app)
            .get('/unknown-endpoint')
            .set('Accept', 'application/json')
            .expect('Content-Type', "text/html; charset=utf-8")
            .end(function(err, res) {
                // Check if response is 400
                expect(res).to.have.status(400);
                // Check if page content is as expected
                var $ = cheerio.load(res.text);
                var title = $('form > p').text();
                assert.equal(title, 'Sorry the URL \'localhost:8080/unknown-endpoint\' does not exist.')
                done()
            })
    });
});

describe('GET /login-fail', function () {
  it("should return webpage with title of 'You have entered an invalid username or password. Please try again or create a new account.'' ", function (done) {
      request(app)
      .get('/login-fail')
      .expect('Content-Type', "text/html; charset=utf-8")
      .end(function(err, res) {
        var $ = cheerio.load(res.text);
        expect(res).to.have.status(200);
        var title = $('div > h1').text();
        assert.equal(title, 'You have entered an invalid username or password. Please try again or create a new account.')
        done()
      })
  });
});


describe('GET /', function () {

it("should return webpage with title of 'Welcome to the login page.' ", function (done) {
    request(app)
        // put the end point you want to testin the .get('') method 
        .get('/')
        // I got no idea what the .set() method does
        .set('Accept', 'application/json')
        // this .expect() means you are expecting the response to be a html file!
        .expect('Content-Type', "text/html; charset=utf-8")
        // this .expect() means you are expecting a 200 status code
        // Only way to see what was returned (as far as I know) is to use .end and a callback
        .end(function(err, res) {
        // res is the app's response for the end point (whatever page gave for response.render() or response.send())
        expect(res).to.have.status(200);
        var $ = cheerio.load(res.text);
        var title = $('div > h1').text();
        assert.equal(title, 'Welcome to the login page.')
        done()
        })
    });
});







describe('GET /logout', function () {
  it("should return no webpage", function (done) {
      request(app)
          .get('/logout')
          .set('Accept', 'application/json')
          .expect('Content-Type', "text/html; charset=utf-8")
          .end(function(err, res) {
            // expect(res).to.have.status(200);
            assert.equal(res.text, '')
            done()
          })
  });
});

describe('GET/POST /register', function () {
  it("should return webpage with title of 'To create an account please enter credentials.' ", function (done) {
      request(app)
          .get('/register')
          .set('Accept', 'application/json')
          .expect('Content-Type', "text/html; charset=utf-8")
          .end(function(err, res) {
            expect(res).to.have.status(200);
            var $ = cheerio.load(res.text);
            var title = $('div > h1').text();
            assert.equal(title, "To create an account please enter credentials.")
            done()
          })
  });

  it("Invalid firstname", function (done) {
    request(app)
        .post('/register')
        .send({
          '_method': 'post',
          'firstname': '',
          'lastname': 'validLastname',
          'username': 'validUsername',
          'password': 'validPassword',
          'confirm_password': 'validPassword'
        })
        .then((res) => {
          expect(res).to.have.status(200);
          var $ = cheerio.load(res.text);
          var title = $('h1[class=title]').text();
          assert.equal(title, "First name must be 3-30 characters long and must only contain letters.")
          done()
        })
  });

  it("Invalid lastname", function (done) {
    request(app)
        .post('/register')
        .send({
          '_method': 'post',
          'firstname': 'validFirstname',
          'lastname': '',
          'username': 'validUsername',
          'password': 'validPassword',
          'confirm_password': 'validPassword'
        })
        .then((res) => {
          expect(res).to.have.status(200);
          var $ = cheerio.load(res.text);
          var title = $('h1[class=title]').text();
          assert.equal(title, "Last name must be 3-30 characters long and must only contain letters.")
          done()
        })
  });

  it("Invalid username", function (done) {
    request(app)
        .post('/register')
        .send({
          '_method': 'post',
          'firstname': 'validFirstname',
          'lastname': 'validLastname',
          'username': '',
          'password': 'validPassword',
          'confirm_password': 'validPassword'
        })
        .then((res) => {
          expect(res).to.have.status(200);
          var $ = cheerio.load(res.text);
          var title = $('h1[class=title]').text();
          assert.equal(title, "Username must have 5-15 characters and may only be alphanumeric.")
          done()
        })
  });

  it("Invalid password", function (done) {
    request(app)
        .post('/register')
        .send({
          '_method': 'post',
          'firstname': 'validFirstname',
          'lastname': 'validLastname',
          'username': 'validUsername',
          'password': '',
          'confirm_password': 'validPassword'
        })
        .then((res) => {
          // (res.text);
          expect(res).to.have.status(200);
          var $ = cheerio.load(res.text);
          var title = $('h1[class=title]').text();
          assert.equal(title, "Password must have 5-15 characters and may only be alphanumeric.")
          done()
        })
  });

  it("Passwords do not match", function (done) {
    request(app)
        .post('/register')
        .send({
          '_method': 'post',
          'firstname': 'validFirstname',
          'lastname': 'validLastname',
          'username': 'validUsername',
          'password': 'validPassword',
          'confirm_password': ''
        })
        .then((res) => {
          // (res.text);
          expect(res).to.have.status(200);
          var $ = cheerio.load(res.text);
          var title = $('h1[class=title]').text();
          assert.equal(title, "Passwords do not match. Please try again.")
          done()
        })
  }); 

  // it("Successful creation", function (done) {
  //   request(app)
  //       .post('/register')
  //       .send({
  //         '_method': 'post',
  //         'firstname': 'validFirstname',
  //         'lastname': 'validLastname',
  //         'username': 'validUsername',
  //         'password': 'validPassword',
  //         'confirm_password': 'validPassword'
  //       })
  //       .then((res) => {
  //         // (res.text);
  //         expect(res).to.have.status(200);
  //         var $ = cheerio.load(res.text);
  //         var title = $('h1[class=title]').text();
  //         assert.equal(title, "You have successfully created an account with the username \'validUsername\' and have been granted $10,000 USD. Head over to the login page.")
  //         done()
  //       })
  // });




});

describe('GET /trading', function () {
  it("should return webpage with title of 'You are not logged in. You must be logged in to view this page.' ", function (done) {
      request(app)
          .get('/trading')
          .set('Accept', 'application/json')
          .expect('Content-Type', "text/html; charset=utf-8")
          .expect(200)
          .end(function(err, res) {
            var $ = cheerio.load(res.text);
            var title = $('div[role=alert]').text();


            assert.equal(title, "You are not logged in. You must be logged in to view this page.")
            done()
          })
  });
});





var agent = chai.request.agent(app)
describe('POST /login', function () {
    it("Successful log in", function (done) {
        agent
        .post('/login')
        .send({
            '_method': 'post',
            'username': 'JoeySalads',
            'password': 'Castle12345'
        })
        .then(function (res) {
          // The `agent` now has the sessionid cookie saved, and will send it
          // back to the server in the next request:
        return agent.get('/trading-success')
            .then(function (res) {
                // (res.text)
                var $ = cheerio.load(res.text);
                var title = $('div[role=alert]').text();
                var display = $('title').text();

                assert.equal(title, "Welcome to the trading page.");
                assert.equal(display, "Trading");
                expect(res).to.have.status(200);
                done()
            });
        });
    });

    it("Invalid username", function (done) {
      agent
      .post('/login')
      .send({
          '_method': 'post',
          'username': 'Invalid Username',
          'password': 'Castle12345'
      })
      .then(function (res) {
    
      return agent.get('/trading-success')
          .then(function (res) {
            // Expect to be redirected
            expect(res).to.redirect;
            // (res.text)
            var $ = cheerio.load(res.text);
            var title = $('h1[class=title]').text();
            var display = $('title').text();
    
            assert.equal(title, "Welcome to the login page.");
            assert.equal(display, "Login");
            expect(res).to.have.status(200);
            done()
          });
      });
    });

    it("Invalid password", function (done) {
      agent
      .post('/login')
      .send({
          '_method': 'post',
          'username': 'JoeySalads',
          'password': 'Invalid password'
      })
      .then(function (res) {
    
      return agent.get('/trading-success')
          .then(function (res) {
            // Expect to be redirected
            expect(res).to.redirect;
            var $ = cheerio.load(res.text);
            var title = $('h1[class=title]').text();
            var display = $('title').text();
    
            assert.equal(title, "Welcome to the login page.");
            assert.equal(display, "Login");
            expect(res).to.have.status(200);
            done()
          });
      });
    });
});




describe('GET /news-hub', function () {
  it("Check stock data was received", function (done) {
      agent
      .post('/login')
      .send({
          '_method': 'post',
          'username': 'JoeySalads',
          'password': 'Castle12345'
      })
      .then(function (res) {
      return agent.get('/news-hub')
          .then(function (res) {
              
              var nflx_patt = /NFLX/
              assert.isTrue(nflx_patt.test(res.text))
              var aapl_patt = /AAPL/
              assert.isTrue(aapl_patt.test(res.text))
              var tsla_patt = /TSLA/
              assert.isTrue(tsla_patt.test(res.text))
              var goog_patt = /GOOG/
              assert.isTrue(goog_patt.test(res.text))
              var sbux_patt = /SBUX/
              assert.isTrue(sbux_patt.test(res.text))
              var fb_patt = /FB/
              assert.isTrue(fb_patt.test(res.text))
              var ba_patt = /BA/
              assert.isTrue(ba_patt.test(res.text))
              var baba_patt = /BABA/
              assert.isTrue(baba_patt.test(res.text))
              var nke_patt = /NKE/
              assert.isTrue(nke_patt.test(res.text))
              var amzn_patt = /AMZN/
              assert.isTrue(amzn_patt.test(res.text))

              expect(res).to.have.status(200);
              done()
          });
      });
  });

  it("Check currency data was received", function (done) {
    agent
    .post('/login')
    .send({
        '_method': 'post',
        'username': 'JoeySalads',
        'password': 'Castle12345'
    })
    .then(function (res) {
    return agent.get('/news-hub')
        .then(function (res) {
            var cad_patt = /CAD/
            assert.isTrue(cad_patt.test(res.text))
            var bgn_patt = /BGN/
            assert.isTrue(bgn_patt.test(res.text))
            var eur_patt = /EUR/
            assert.isTrue(eur_patt.test(res.text))
            var jpy_patt = /JPY/
            assert.isTrue(jpy_patt.test(res.text))
            var aud_patt = /AUD/
            assert.isTrue(aud_patt.test(res.text))
            var hkd_patt = /HKD/
            assert.isTrue(hkd_patt.test(res.text))
            var gbp_patt = /GBP/
            assert.isTrue(gbp_patt.test(res.text))
            var mxn_patt = /MXN/
            assert.isTrue(mxn_patt.test(res.text))
            var inr_patt = /INR/
            assert.isTrue(inr_patt.test(res.text))
            var cny_patt = /CNY/
            assert.isTrue(cny_patt.test(res.text))

            expect(res).to.have.status(200);
            done()
        });
    });
});
});



var agent = chai.request.agent(app)
describe('GET /news/currency/:currencyCode', function () {
    it("Check if graph was generated", function (done) {
        agent
        .post('/login')
        .send({
            '_method': 'post',
            'username': 'JoeySalads',
            'password': 'Castle12345'
        })
        .then(function (res) {
        return agent.get('/news/currency/CAD')
            .then(function (res) {
                var $ = cheerio.load(res.text);
                var display = $('title').text();
                assert.equal(display, "CAD Price");
                var patt = /compared to USD/;
                assert.isTrue(patt.test(res.text))
                expect(res).to.have.status(200);
                done()
            });
        });
    });
});


describe('GET /news/stock/:ticker', function () {
    it("Check if graph was generated", function (done) {
        agent
        .post('/login')
        .send({
            '_method': 'post',
            'username': 'JoeySalads',
            'password': 'Castle12345'
        })
        .then(function (res) {
        return agent.get('/news/stock/FB')
            .then(function (res) {
                var $ = cheerio.load(res.text);
                var display = $('title').text();
                assert.equal(display, "FB Price");
                var patt = /compared to USD/;
                assert.isTrue(patt.test(res.text))
                expect(res).to.have.status(200);
                done()
            });
        });
    });
});






const mock_data = {
  "NFLX": {
    "chart": [
      {
        "date": "2019-03-29",
        "open": 357.16,
        "high": 358.25,
        "low": 353.71,
        "close": 356.56,
        "volume": 4705636,
        "unadjustedVolume": 4705636,
        "change": 1.95,
        "changePercent": 0.55,
        "vwap": 356.0135,
        "label": "Mar 29",
        "changeOverTime": 0
      },
      {
        "date": "2019-04-01",
        "open": 359,
        "high": 368.33,
        "low": 358.51,
        "close": 366.96,
        "volume": 7036097,
        "unadjustedVolume": 7036097,
        "change": 10.4,
        "changePercent": 2.917,
        "vwap": 364.5303,
        "label": "Apr 1",
        "changeOverTime": 0.02916760152568986
      },
      {
        "date": "2019-04-02",
        "open": 366.25,
        "high": 368.42,
        "low": 362.22,
        "close": 367.72,
        "volume": 5158742,
        "unadjustedVolume": 5158742,
        "change": 0.76,
        "changePercent": 0.207,
        "vwap": 365.7282,
        "label": "Apr 2",
        "changeOverTime": 0.031299080098721184
      },
      {
        "date": "2019-04-03",
        "open": 369.26,
        "high": 373.4105,
        "low": 366.19,
        "close": 369.75,
        "volume": 5376623,
        "unadjustedVolume": 5376623,
        "change": 2.03,
        "changePercent": 0.552,
        "vwap": 370.3597,
        "label": "Apr 3",
        "changeOverTime": 0.0369923715503702
      },
      {
        "date": "2019-04-04",
        "open": 370.07,
        "high": 372.05,
        "low": 362.4,
        "close": 367.88,
        "volume": 4627305,
        "unadjustedVolume": 4627305,
        "change": -1.87,
        "changePercent": -0.506,
        "vwap": 366.7724,
        "label": "Apr 4",
        "changeOverTime": 0.03174781242988555
      },
      {
        "date": "2019-04-05",
        "open": 369,
        "high": 369.8,
        "low": 364.66,
        "close": 365.49,
        "volume": 3905493,
        "unadjustedVolume": 3905493,
        "change": -2.39,
        "changePercent": -0.65,
        "vwap": 366.5254,
        "label": "Apr 5",
        "changeOverTime": 0.025044873233116466
      },
      {
        "date": "2019-04-08",
        "open": 365.11,
        "high": 365.94,
        "low": 359.93,
        "close": 361.41,
        "volume": 4653810,
        "unadjustedVolume": 4653810,
        "change": -4.08,
        "changePercent": -1.116,
        "vwap": 362.0843,
        "label": "Apr 8",
        "changeOverTime": 0.01360219878842277
      },
      {
        "date": "2019-04-09",
        "open": 360.54,
        "high": 366.74,
        "low": 359,
        "close": 364.71,
        "volume": 5439228,
        "unadjustedVolume": 5439228,
        "change": 3.3,
        "changePercent": 0.913,
        "vwap": 364.0601,
        "label": "Apr 9",
        "changeOverTime": 0.022857303118689637
      },
      {
        "date": "2019-04-10",
        "open": 365.79,
        "high": 368.8481,
        "low": 362.25,
        "close": 363.92,
        "volume": 4545561,
        "unadjustedVolume": 4545561,
        "change": -0.79,
        "changePercent": -0.217,
        "vwap": 365.0883,
        "label": "Apr 10",
        "changeOverTime": 0.020641687233565218
      },
      {
        "date": "2019-04-11",
        "open": 365,
        "high": 370.12,
        "low": 360.81,
        "close": 367.65,
        "volume": 6526899,
        "unadjustedVolume": 6526899,
        "change": 3.73,
        "changePercent": 1.025,
        "vwap": 366.5699,
        "label": "Apr 11",
        "changeOverTime": 0.03110275970383659
      },
      {
        "date": "2019-04-12",
        "open": 360.69,
        "high": 361.75,
        "low": 349.36,
        "close": 351.14,
        "volume": 15646199,
        "unadjustedVolume": 15646199,
        "change": -16.51,
        "changePercent": -4.491,
        "vwap": 353.783,
        "label": "Apr 12",
        "changeOverTime": -0.01520080771819614
      },
      {
        "date": "2019-04-15",
        "open": 350.71,
        "high": 352.21,
        "low": 342.27,
        "close": 348.87,
        "volume": 8842344,
        "unadjustedVolume": 8842344,
        "change": -2.27,
        "changePercent": -0.646,
        "vwap": 346.937,
        "label": "Apr 15",
        "changeOverTime": -0.021567197666591872
      },
      {
        "date": "2019-04-16",
        "open": 355,
        "high": 364.4787,
        "low": 352.72,
        "close": 359.46,
        "volume": 18740232,
        "unadjustedVolume": 18740232,
        "change": 10.59,
        "changePercent": 3.036,
        "vwap": 359.3632,
        "label": "Apr 16",
        "changeOverTime": 0.00813327350235578
      },
      {
        "date": "2019-04-17",
        "open": 365.05,
        "high": 368.764,
        "low": 350.6,
        "close": 354.74,
        "volume": 18054101,
        "unadjustedVolume": 18054101,
        "change": -4.72,
        "changePercent": -1.313,
        "vwap": 357.1543,
        "label": "Apr 17",
        "changeOverTime": -0.005104330266995718
      },
      {
        "date": "2019-04-18",
        "open": 355,
        "high": 360.41,
        "low": 351.64,
        "close": 360.35,
        "volume": 8353165,
        "unadjustedVolume": 8353165,
        "change": 5.61,
        "changePercent": 1.581,
        "vwap": 357.8401,
        "label": "Apr 18",
        "changeOverTime": 0.010629347094458213
      },
      {
        "date": "2019-04-22",
        "open": 359.7,
        "high": 377.69,
        "low": 359,
        "close": 377.34,
        "volume": 11980534,
        "unadjustedVolume": 11980534,
        "change": 16.99,
        "changePercent": 4.715,
        "vwap": 371.7159,
        "label": "Apr 22",
        "changeOverTime": 0.058279111509984216
      },
      {
        "date": "2019-04-23",
        "open": 375.45,
        "high": 384.8,
        "low": 374.7069,
        "close": 381.89,
        "volume": 10089820,
        "unadjustedVolume": 10089820,
        "change": 4.55,
        "changePercent": 1.206,
        "vwap": 380.8117,
        "label": "Apr 23",
        "changeOverTime": 0.07103993717747359
      },
      {
        "date": "2019-04-24",
        "open": 381.07,
        "high": 381.9,
        "low": 373.2698,
        "close": 374.23,
        "volume": 6541872,
        "unadjustedVolume": 6541872,
        "change": -7.66,
        "changePercent": -2.006,
        "vwap": 376.7409,
        "label": "Apr 24",
        "changeOverTime": 0.04955687682297514
      },
      {
        "date": "2019-04-25",
        "open": 374.49,
        "high": 374.76,
        "low": 365.7,
        "close": 368.33,
        "volume": 6255496,
        "unadjustedVolume": 6255496,
        "change": -5.9,
        "changePercent": -1.577,
        "vwap": 369.0418,
        "label": "Apr 25",
        "changeOverTime": 0.03300987211128557
      },
      {
        "date": "2019-04-26",
        "open": 368.35,
        "high": 375.14,
        "low": 366.24,
        "close": 374.85,
        "volume": 5621901,
        "unadjustedVolume": 5621901,
        "change": 6.52,
        "changePercent": 1.77,
        "vwap": 372.1711,
        "label": "Apr 26",
        "changeOverTime": 0.051295714606237434
      },
      {
        "date": "2019-04-29",
        "open": 373.68,
        "high": 374.5753,
        "low": 369.115,
        "close": 371.83,
        "volume": 3821703,
        "unadjustedVolume": 3821703,
        "change": -3.02,
        "changePercent": -0.806,
        "vwap": 372.2549,
        "label": "Apr 29",
        "changeOverTime": 0.04282589185550814
      },
      {
        "date": "2019-04-30",
        "open": 369.56,
        "high": 374.5,
        "low": 368.348,
        "close": 370.54,
        "volume": 3870095,
        "unadjustedVolume": 3870095,
        "change": -1.29,
        "changePercent": -0.347,
        "vwap": 371.6669,
        "label": "Apr 30",
        "changeOverTime": 0.03920798743549478
      },
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
      }
    ]
  },
  "AAPL": {
    "chart": [
      {
        "date": "2019-03-29",
        "open": 189.83,
        "high": 190.08,
        "low": 188.54,
        "close": 189.95,
        "volume": 23563961,
        "unadjustedVolume": 23563961,
        "change": 1.23,
        "changePercent": 0.652,
        "vwap": 189.4892,
        "label": "Mar 29",
        "changeOverTime": 0
      },
      {
        "date": "2019-04-01",
        "open": 191.64,
        "high": 191.68,
        "low": 188.38,
        "close": 191.24,
        "volume": 27861964,
        "unadjustedVolume": 27861964,
        "change": 1.29,
        "changePercent": 0.679,
        "vwap": 190.2816,
        "label": "Apr 1",
        "changeOverTime": 0.006791260858120666
      },
      {
        "date": "2019-04-02",
        "open": 191.09,
        "high": 194.46,
        "low": 191.05,
        "close": 194.02,
        "volume": 22765732,
        "unadjustedVolume": 22765732,
        "change": 2.78,
        "changePercent": 1.454,
        "vwap": 193.0776,
        "label": "Apr 2",
        "changeOverTime": 0.02142669123453552
      },
      {
        "date": "2019-04-03",
        "open": 193.25,
        "high": 196.5,
        "low": 193.15,
        "close": 195.35,
        "volume": 23271830,
        "unadjustedVolume": 23271830,
        "change": 1.33,
        "changePercent": 0.685,
        "vwap": 195.2951,
        "label": "Apr 3",
        "changeOverTime": 0.028428533824690738
      },
      {
        "date": "2019-04-04",
        "open": 194.79,
        "high": 196.37,
        "low": 193.14,
        "close": 195.69,
        "volume": 19114275,
        "unadjustedVolume": 19114275,
        "change": 0.34,
        "changePercent": 0.174,
        "vwap": 195.6612,
        "label": "Apr 4",
        "changeOverTime": 0.0302184785469861
      },
      {
        "date": "2019-04-05",
        "open": 196.45,
        "high": 197.1,
        "low": 195.93,
        "close": 197,
        "volume": 18526644,
        "unadjustedVolume": 18526644,
        "change": 1.31,
        "changePercent": 0.669,
        "vwap": 196.6188,
        "label": "Apr 5",
        "changeOverTime": 0.03711503027112404
      },
      {
        "date": "2019-04-08",
        "open": 196.42,
        "high": 200.23,
        "low": 196.34,
        "close": 200.1,
        "volume": 25881697,
        "unadjustedVolume": 25881697,
        "change": 3.1,
        "changePercent": 1.574,
        "vwap": 198.9594,
        "label": "Apr 8",
        "changeOverTime": 0.05343511450381683
      },
      {
        "date": "2019-04-09",
        "open": 200.32,
        "high": 202.85,
        "low": 199.23,
        "close": 199.5,
        "volume": 35768237,
        "unadjustedVolume": 35768237,
        "change": -0.6,
        "changePercent": -0.3,
        "vwap": 200.9319,
        "label": "Apr 9",
        "changeOverTime": 0.05027638852329567
      },
      {
        "date": "2019-04-10",
        "open": 198.68,
        "high": 200.74,
        "low": 198.18,
        "close": 200.62,
        "volume": 21695288,
        "unadjustedVolume": 21695288,
        "change": 1.12,
        "changePercent": 0.561,
        "vwap": 199.5162,
        "label": "Apr 10",
        "changeOverTime": 0.056172677020268576
      },
      {
        "date": "2019-04-11",
        "open": 200.85,
        "high": 201,
        "low": 198.4431,
        "close": 198.95,
        "volume": 20900808,
        "unadjustedVolume": 20900808,
        "change": -1.67,
        "changePercent": -0.832,
        "vwap": 199.7413,
        "label": "Apr 11",
        "changeOverTime": 0.04738088970781785
      },
      {
        "date": "2019-04-12",
        "open": 199.2,
        "high": 200.14,
        "low": 196.21,
        "close": 198.87,
        "volume": 27760668,
        "unadjustedVolume": 27760668,
        "change": -0.08,
        "changePercent": -0.04,
        "vwap": 198.3105,
        "label": "Apr 12",
        "changeOverTime": 0.04695972624374844
      },
      {
        "date": "2019-04-15",
        "open": 198.58,
        "high": 199.85,
        "low": 198.01,
        "close": 199.23,
        "volume": 17536646,
        "unadjustedVolume": 17536646,
        "change": 0.36,
        "changePercent": 0.181,
        "vwap": 198.9772,
        "label": "Apr 15",
        "changeOverTime": 0.048854961832061075
      },
      {
        "date": "2019-04-16",
        "open": 199.46,
        "high": 201.37,
        "low": 198.56,
        "close": 199.25,
        "volume": 25696385,
        "unadjustedVolume": 25696385,
        "change": 0.02,
        "changePercent": 0.01,
        "vwap": 199.9028,
        "label": "Apr 16",
        "changeOverTime": 0.04896025269807851
      },
      {
        "date": "2019-04-17",
        "open": 199.54,
        "high": 203.38,
        "low": 198.61,
        "close": 203.13,
        "volume": 28906780,
        "unadjustedVolume": 28906780,
        "change": 3.88,
        "changePercent": 1.947,
        "vwap": 201.8086,
        "label": "Apr 17",
        "changeOverTime": 0.06938668070544884
      },
      {
        "date": "2019-04-18",
        "open": 203.12,
        "high": 204.15,
        "low": 202.52,
        "close": 203.86,
        "volume": 24195766,
        "unadjustedVolume": 24195766,
        "change": 0.73,
        "changePercent": 0.359,
        "vwap": 203.5071,
        "label": "Apr 18",
        "changeOverTime": 0.07322979731508306
      },
      {
        "date": "2019-04-22",
        "open": 202.83,
        "high": 204.94,
        "low": 202.34,
        "close": 204.53,
        "volume": 19439545,
        "unadjustedVolume": 19439545,
        "change": 0.67,
        "changePercent": 0.329,
        "vwap": 204.2089,
        "label": "Apr 22",
        "changeOverTime": 0.07675704132666498
      },
      {
        "date": "2019-04-23",
        "open": 204.43,
        "high": 207.75,
        "low": 203.9,
        "close": 207.48,
        "volume": 23322991,
        "unadjustedVolume": 23322991,
        "change": 2.95,
        "changePercent": 1.442,
        "vwap": 206.4875,
        "label": "Apr 23",
        "changeOverTime": 0.09228744406422744
      },
      {
        "date": "2019-04-24",
        "open": 207.36,
        "high": 208.48,
        "low": 207.05,
        "close": 207.16,
        "volume": 17540609,
        "unadjustedVolume": 17540609,
        "change": -0.32,
        "changePercent": -0.154,
        "vwap": 207.6544,
        "label": "Apr 24",
        "changeOverTime": 0.09060279020794951
      },
      {
        "date": "2019-04-25",
        "open": 206.83,
        "high": 207.76,
        "low": 205.12,
        "close": 205.28,
        "volume": 18543206,
        "unadjustedVolume": 18543206,
        "change": -1.88,
        "changePercent": -0.908,
        "vwap": 206.0656,
        "label": "Apr 25",
        "changeOverTime": 0.08070544880231648
      },
      {
        "date": "2019-04-26",
        "open": 204.9,
        "high": 205,
        "low": 202.12,
        "close": 204.3,
        "volume": 18649102,
        "unadjustedVolume": 18649102,
        "change": -0.98,
        "changePercent": -0.477,
        "vwap": 204.0786,
        "label": "Apr 26",
        "changeOverTime": 0.07554619636746525
      },
      {
        "date": "2019-04-29",
        "open": 204.4,
        "high": 205.97,
        "low": 203.86,
        "close": 204.61,
        "volume": 22204716,
        "unadjustedVolume": 22204716,
        "change": 0.31,
        "changePercent": 0.152,
        "vwap": 204.982,
        "label": "Apr 29",
        "changeOverTime": 0.07717820479073453
      },
      {
        "date": "2019-04-30",
        "open": 203.06,
        "high": 203.4,
        "low": 199.11,
        "close": 200.67,
        "volume": 46534923,
        "unadjustedVolume": 46534923,
        "change": -3.94,
        "changePercent": -1.926,
        "vwap": 200.8479,
        "label": "Apr 30",
        "changeOverTime": 0.05643590418531192
      },
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
        "date": "2019-03-29",
        "open": 278.7,
        "high": 280.16,
        "low": 274.5,
        "close": 279.86,
        "volume": 5991338,
        "unadjustedVolume": 5991338,
        "change": 1.24,
        "changePercent": 0.445,
        "vwap": 278.1097,
        "label": "Mar 29",
        "changeOverTime": 0
      },
      {
        "date": "2019-04-01",
        "open": 282.62,
        "high": 289.2,
        "low": 281.281,
        "close": 289.18,
        "volume": 8110439,
        "unadjustedVolume": 8110439,
        "change": 9.32,
        "changePercent": 3.33,
        "vwap": 286.1634,
        "label": "Apr 1",
        "changeOverTime": 0.03330236546844848
      },
      {
        "date": "2019-04-02",
        "open": 288.3,
        "high": 289.44,
        "low": 283.88,
        "close": 285.88,
        "volume": 5478940,
        "unadjustedVolume": 5478940,
        "change": -3.3,
        "changePercent": -1.141,
        "vwap": 286.2483,
        "label": "Apr 2",
        "changeOverTime": 0.02151075537768878
      },
      {
        "date": "2019-04-03",
        "open": 287.32,
        "high": 296.17,
        "low": 287.17,
        "close": 291.81,
        "volume": 7929864,
        "unadjustedVolume": 7929864,
        "change": 5.93,
        "changePercent": 2.074,
        "vwap": 292.9118,
        "label": "Apr 3",
        "changeOverTime": 0.04269992138926602
      },
      {
        "date": "2019-04-04",
        "open": 261.89,
        "high": 271.2,
        "low": 260.59,
        "close": 267.78,
        "volume": 23720729,
        "unadjustedVolume": 23720729,
        "change": -24.03,
        "changePercent": -8.235,
        "vwap": 267.045,
        "label": "Apr 4",
        "changeOverTime": -0.043164439362538554
      },
      {
        "date": "2019-04-05",
        "open": 269.86,
        "high": 276.1,
        "low": 266.11,
        "close": 274.96,
        "volume": 13038257,
        "unadjustedVolume": 13038257,
        "change": 7.18,
        "changePercent": 2.681,
        "vwap": 272.5538,
        "label": "Apr 5",
        "changeOverTime": -0.017508754377188716
      },
      {
        "date": "2019-04-08",
        "open": 277.69,
        "high": 281.16,
        "low": 270.44,
        "close": 273.2,
        "volume": 10410436,
        "unadjustedVolume": 10410436,
        "change": -1.76,
        "changePercent": -0.64,
        "vwap": 275.049,
        "label": "Apr 8",
        "changeOverTime": -0.023797613092260504
      },
      {
        "date": "2019-04-09",
        "open": 271.65,
        "high": 275,
        "low": 269.61,
        "close": 272.31,
        "volume": 5904031,
        "unadjustedVolume": 5904031,
        "change": -0.89,
        "changePercent": -0.326,
        "vwap": 272.7636,
        "label": "Apr 9",
        "changeOverTime": -0.026977774601586547
      },
      {
        "date": "2019-04-10",
        "open": 276.74,
        "high": 278.38,
        "low": 272.8925,
        "close": 276.06,
        "volume": 7061314,
        "unadjustedVolume": 7061314,
        "change": 3.75,
        "changePercent": 1.377,
        "vwap": 276.001,
        "label": "Apr 10",
        "changeOverTime": -0.013578217680268746
      },
      {
        "date": "2019-04-11",
        "open": 268.3,
        "high": 270.5,
        "low": 265.6,
        "close": 268.42,
        "volume": 9835927,
        "unadjustedVolume": 9835927,
        "change": -7.64,
        "changePercent": -2.768,
        "vwap": 267.9454,
        "label": "Apr 11",
        "changeOverTime": -0.04087758164796683
      },
      {
        "date": "2019-04-12",
        "open": 270.22,
        "high": 271.95,
        "low": 266.83,
        "close": 267.7,
        "volume": 6745974,
        "unadjustedVolume": 6745974,
        "change": -0.72,
        "changePercent": -0.268,
        "vwap": 269.0359,
        "label": "Apr 12",
        "changeOverTime": -0.04345029657685995
      },
      {
        "date": "2019-04-15",
        "open": 268.63,
        "high": 268.88,
        "low": 258.63,
        "close": 266.38,
        "volume": 10038579,
        "unadjustedVolume": 10038579,
        "change": -1.32,
        "changePercent": -0.493,
        "vwap": 262.7922,
        "label": "Apr 15",
        "changeOverTime": -0.04816694061316379
      },
      {
        "date": "2019-04-16",
        "open": 265.75,
        "high": 275,
        "low": 264.72,
        "close": 273.36,
        "volume": 7272930,
        "unadjustedVolume": 7272930,
        "change": 6.98,
        "changePercent": 2.62,
        "vwap": 271.7304,
        "label": "Apr 16",
        "changeOverTime": -0.02322589866361752
      },
      {
        "date": "2019-04-17",
        "open": 274.75,
        "high": 274.79,
        "low": 268.535,
        "close": 271.23,
        "volume": 5126468,
        "unadjustedVolume": 5126468,
        "change": -2.13,
        "changePercent": -0.779,
        "vwap": 271.714,
        "label": "Apr 17",
        "changeOverTime": -0.030836846994926018
      },
      {
        "date": "2019-04-18",
        "open": 271.23,
        "high": 274.84,
        "low": 269.75,
        "close": 273.26,
        "volume": 5876325,
        "unadjustedVolume": 5876325,
        "change": 2.03,
        "changePercent": 0.748,
        "vwap": 273.069,
        "label": "Apr 18",
        "changeOverTime": -0.023583220181519413
      },
      {
        "date": "2019-04-22",
        "open": 269,
        "high": 269.68,
        "low": 262.48,
        "close": 262.75,
        "volume": 12147141,
        "unadjustedVolume": 12147141,
        "change": -10.51,
        "changePercent": -3.846,
        "vwap": 264.3664,
        "label": "Apr 22",
        "changeOverTime": -0.0611377117129994
      },
      {
        "date": "2019-04-23",
        "open": 260.15,
        "high": 265.6,
        "low": 255.75,
        "close": 263.9,
        "volume": 10943859,
        "unadjustedVolume": 10943859,
        "change": 1.15,
        "changePercent": 0.438,
        "vwap": 262.1931,
        "label": "Apr 23",
        "changeOverTime": -0.05702851425712869
      },
      {
        "date": "2019-04-24",
        "open": 263.85,
        "high": 265.32,
        "low": 258,
        "close": 258.66,
        "volume": 10727454,
        "unadjustedVolume": 10727454,
        "change": -5.24,
        "changePercent": -1.986,
        "vwap": 261.1635,
        "label": "Apr 24",
        "changeOverTime": -0.07575216179518326
      },
      {
        "date": "2019-04-25",
        "open": 255,
        "high": 259,
        "low": 246.07,
        "close": 247.63,
        "volume": 21849393,
        "unadjustedVolume": 21849393,
        "change": -11.03,
        "changePercent": -4.264,
        "vwap": 250.7017,
        "label": "Apr 25",
        "changeOverTime": -0.1151647252197528
      },
      {
        "date": "2019-04-26",
        "open": 246.5,
        "high": 246.68,
        "low": 231.13,
        "close": 235.14,
        "volume": 22360709,
        "unadjustedVolume": 22360709,
        "change": -12.49,
        "changePercent": -5.044,
        "vwap": 237.5072,
        "label": "Apr 26",
        "changeOverTime": -0.15979418280568866
      },
      {
        "date": "2019-04-29",
        "open": 235.86,
        "high": 243.98,
        "low": 232.17,
        "close": 241.47,
        "volume": 16714476,
        "unadjustedVolume": 16714476,
        "change": 6.33,
        "changePercent": 2.692,
        "vwap": 239.583,
        "label": "Apr 29",
        "changeOverTime": -0.13717573072250416
      },
      {
        "date": "2019-04-30",
        "open": 242.06,
        "high": 244.21,
        "low": 237,
        "close": 238.69,
        "volume": 9464628,
        "unadjustedVolume": 9464628,
        "change": -2.78,
        "changePercent": -1.151,
        "vwap": 240.0919,
        "label": "Apr 30",
        "changeOverTime": -0.14710926892017442
      },
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
      }
    ]
  },
  "GOOG": {
    "chart": [
      {
        "date": "2019-03-29",
        "open": 1174.9,
        "high": 1178.99,
        "low": 1162.88,
        "close": 1173.31,
        "volume": 1269979,
        "unadjustedVolume": 1269979,
        "change": 4.82,
        "changePercent": 0.412,
        "vwap": 1171.78,
        "label": "Mar 29",
        "changeOverTime": 0
      },
      {
        "date": "2019-04-01",
        "open": 1184.1,
        "high": 1196.66,
        "low": 1182,
        "close": 1194.43,
        "volume": 1252757,
        "unadjustedVolume": 1252757,
        "change": 21.12,
        "changePercent": 1.8,
        "vwap": 1191.27,
        "label": "Apr 1",
        "changeOverTime": 0.01800035796166411
      },
      {
        "date": "2019-04-02",
        "open": 1195.32,
        "high": 1201.35,
        "low": 1185.71,
        "close": 1200.49,
        "volume": 827973,
        "unadjustedVolume": 827973,
        "change": 6.06,
        "changePercent": 0.507,
        "vwap": 1195.39,
        "label": "Apr 2",
        "changeOverTime": 0.023165233399527887
      },
      {
        "date": "2019-04-03",
        "open": 1207.48,
        "high": 1216.3,
        "low": 1200.5,
        "close": 1205.92,
        "volume": 1017838,
        "unadjustedVolume": 1017838,
        "change": 5.43,
        "changePercent": 0.452,
        "vwap": 1207.68,
        "label": "Apr 3",
        "changeOverTime": 0.027793166341376217
      },
      {
        "date": "2019-04-04",
        "open": 1205.94,
        "high": 1215.67,
        "low": 1204.13,
        "close": 1215,
        "volume": 950747,
        "unadjustedVolume": 950747,
        "change": 9.08,
        "changePercent": 0.753,
        "vwap": 1212.07,
        "label": "Apr 4",
        "changeOverTime": 0.03553195660140974
      },
      {
        "date": "2019-04-05",
        "open": 1214.99,
        "high": 1216.22,
        "low": 1205.03,
        "close": 1207.15,
        "volume": 907152,
        "unadjustedVolume": 907152,
        "change": -7.85,
        "changePercent": -0.646,
        "vwap": 1209.62,
        "label": "Apr 5",
        "changeOverTime": 0.02884148264312087
      },
      {
        "date": "2019-04-08",
        "open": 1207.89,
        "high": 1208.69,
        "low": 1199.86,
        "close": 1203.84,
        "volume": 860363,
        "unadjustedVolume": 860363,
        "change": -3.31,
        "changePercent": -0.274,
        "vwap": 1204.02,
        "label": "Apr 8",
        "changeOverTime": 0.026020403814848568
      },
      {
        "date": "2019-04-09",
        "open": 1196,
        "high": 1202.29,
        "low": 1193.08,
        "close": 1197.25,
        "volume": 876381,
        "unadjustedVolume": 876381,
        "change": -6.59,
        "changePercent": -0.547,
        "vwap": 1196.84,
        "label": "Apr 9",
        "changeOverTime": 0.020403814848590787
      },
      {
        "date": "2019-04-10",
        "open": 1200.68,
        "high": 1203.79,
        "low": 1196.43,
        "close": 1202.16,
        "volume": 724643,
        "unadjustedVolume": 724643,
        "change": 4.91,
        "changePercent": 0.41,
        "vwap": 1201.03,
        "label": "Apr 10",
        "changeOverTime": 0.024588557158807253
      },
      {
        "date": "2019-04-11",
        "open": 1203.96,
        "high": 1207.96,
        "low": 1200.13,
        "close": 1204.62,
        "volume": 710231,
        "unadjustedVolume": 710231,
        "change": 2.46,
        "changePercent": 0.205,
        "vwap": 1204.33,
        "label": "Apr 11",
        "changeOverTime": 0.026685189762296363
      },
      {
        "date": "2019-04-12",
        "open": 1210,
        "high": 1218.35,
        "low": 1208.11,
        "close": 1217.87,
        "volume": 933794,
        "unadjustedVolume": 933794,
        "change": 13.25,
        "changePercent": 1.1,
        "vwap": 1213.78,
        "label": "Apr 12",
        "changeOverTime": 0.03797802797214713
      },
      {
        "date": "2019-04-15",
        "open": 1218,
        "high": 1224.2,
        "low": 1209.11,
        "close": 1221.1,
        "volume": 1187519,
        "unadjustedVolume": 1187519,
        "change": 3.23,
        "changePercent": 0.265,
        "vwap": 1217.75,
        "label": "Apr 15",
        "changeOverTime": 0.04073092362632209
      },
      {
        "date": "2019-04-16",
        "open": 1225,
        "high": 1230.82,
        "low": 1220.12,
        "close": 1227.13,
        "volume": 856304,
        "unadjustedVolume": 856304,
        "change": 6.03,
        "changePercent": 0.494,
        "vwap": 1226.11,
        "label": "Apr 16",
        "changeOverTime": 0.045870230373899624
      },
      {
        "date": "2019-04-17",
        "open": 1233,
        "high": 1240.56,
        "low": 1227.82,
        "close": 1236.34,
        "volume": 1221930,
        "unadjustedVolume": 1221930,
        "change": 9.21,
        "changePercent": 0.751,
        "vwap": 1235.58,
        "label": "Apr 17",
        "changeOverTime": 0.05371981829184101
      },
      {
        "date": "2019-04-18",
        "open": 1239.18,
        "high": 1242,
        "low": 1234.61,
        "close": 1236.37,
        "volume": 1331823,
        "unadjustedVolume": 1331823,
        "change": 0.03,
        "changePercent": 0.002,
        "vwap": 1238.2,
        "label": "Apr 18",
        "changeOverTime": 0.05374538698212744
      },
      {
        "date": "2019-04-22",
        "open": 1235.99,
        "high": 1249.09,
        "low": 1228.31,
        "close": 1248.84,
        "volume": 807334,
        "unadjustedVolume": 807334,
        "change": 12.47,
        "changePercent": 1.009,
        "vwap": 1241.78,
        "label": "Apr 22",
        "changeOverTime": 0.06437343924453041
      },
      {
        "date": "2019-04-23",
        "open": 1250.69,
        "high": 1269,
        "low": 1246.38,
        "close": 1264.55,
        "volume": 1319910,
        "unadjustedVolume": 1319910,
        "change": 15.71,
        "changePercent": 1.258,
        "vwap": 1261.28,
        "label": "Apr 23",
        "changeOverTime": 0.07776291005787048
      },
      {
        "date": "2019-04-24",
        "open": 1264.12,
        "high": 1268.01,
        "low": 1255,
        "close": 1256,
        "volume": 1018753,
        "unadjustedVolume": 1018753,
        "change": -8.55,
        "changePercent": -0.676,
        "vwap": 1260.1,
        "label": "Apr 24",
        "changeOverTime": 0.07047583332623097
      },
      {
        "date": "2019-04-25",
        "open": 1264.77,
        "high": 1267.41,
        "low": 1252.03,
        "close": 1263.45,
        "volume": 1107295,
        "unadjustedVolume": 1107295,
        "change": 7.45,
        "changePercent": 0.593,
        "vwap": 1261.37,
        "label": "Apr 25",
        "changeOverTime": 0.0768253914140339
      },
      {
        "date": "2019-04-26",
        "open": 1269,
        "high": 1273.07,
        "low": 1260.32,
        "close": 1272.18,
        "volume": 1241428,
        "unadjustedVolume": 1241428,
        "change": 8.73,
        "changePercent": 0.691,
        "vwap": 1267.97,
        "label": "Apr 26",
        "changeOverTime": 0.08426588028739218
      },
      {
        "date": "2019-04-29",
        "open": 1274,
        "high": 1289.27,
        "low": 1266.29,
        "close": 1287.58,
        "volume": 2499432,
        "unadjustedVolume": 2499432,
        "change": 15.4,
        "changePercent": 1.211,
        "vwap": 1279.08,
        "label": "Apr 29",
        "changeOverTime": 0.0973911413011054
      },
      {
        "date": "2019-04-30",
        "open": 1185,
        "high": 1192.81,
        "low": 1175,
        "close": 1188.48,
        "volume": 6207027,
        "unadjustedVolume": 6207027,
        "change": -99.1,
        "changePercent": -7.697,
        "vwap": 1183.71,
        "label": "Apr 30",
        "changeOverTime": 0.012929234388183919
      },
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
        "date": "2019-03-29",
        "open": 74.01,
        "high": 74.4801,
        "low": 73.53,
        "close": 74.34,
        "volume": 9099492,
        "unadjustedVolume": 9099492,
        "change": 0.38,
        "changePercent": 0.514,
        "vwap": 74.2258,
        "label": "Mar 29",
        "changeOverTime": 0
      },
      {
        "date": "2019-04-01",
        "open": 74.76,
        "high": 74.93,
        "low": 73.73,
        "close": 73.96,
        "volume": 8108429,
        "unadjustedVolume": 8108429,
        "change": -0.38,
        "changePercent": -0.511,
        "vwap": 74.0484,
        "label": "Apr 1",
        "changeOverTime": -0.005111649179445919
      },
      {
        "date": "2019-04-02",
        "open": 74.01,
        "high": 74.45,
        "low": 73.84,
        "close": 74.27,
        "volume": 5520938,
        "unadjustedVolume": 5520938,
        "change": 0.31,
        "changePercent": 0.419,
        "vwap": 74.2368,
        "label": "Apr 2",
        "changeOverTime": -0.0009416195856874817
      },
      {
        "date": "2019-04-03",
        "open": 74.56,
        "high": 74.78,
        "low": 73.87,
        "close": 74.33,
        "volume": 6755601,
        "unadjustedVolume": 6755601,
        "change": 0.06,
        "changePercent": 0.081,
        "vwap": 74.3983,
        "label": "Apr 3",
        "changeOverTime": -0.00013451708366969486
      },
      {
        "date": "2019-04-04",
        "open": 74.5,
        "high": 74.67,
        "low": 73.98,
        "close": 74.35,
        "volume": 5449896,
        "unadjustedVolume": 5449896,
        "change": 0.02,
        "changePercent": 0.027,
        "vwap": 74.3094,
        "label": "Apr 4",
        "changeOverTime": 0.00013451708366950368
      },
      {
        "date": "2019-04-05",
        "open": 74.35,
        "high": 75.08,
        "low": 74.35,
        "close": 75.03,
        "volume": 5346334,
        "unadjustedVolume": 5346334,
        "change": 0.68,
        "changePercent": 0.915,
        "vwap": 74.9262,
        "label": "Apr 5",
        "changeOverTime": 0.009281678773204165
      },
      {
        "date": "2019-04-08",
        "open": 74.47,
        "high": 75.3,
        "low": 74.47,
        "close": 75.2,
        "volume": 5140455,
        "unadjustedVolume": 5140455,
        "change": 0.17,
        "changePercent": 0.227,
        "vwap": 75.0351,
        "label": "Apr 8",
        "changeOverTime": 0.011568469195587832
      },
      {
        "date": "2019-04-09",
        "open": 74.87,
        "high": 75.23,
        "low": 74.8,
        "close": 75.12,
        "volume": 4905834,
        "unadjustedVolume": 4905834,
        "change": -0.08,
        "changePercent": -0.106,
        "vwap": 75.0053,
        "label": "Apr 9",
        "changeOverTime": 0.010492332526230845
      },
      {
        "date": "2019-04-10",
        "open": 75.21,
        "high": 75.815,
        "low": 75.21,
        "close": 75.48,
        "volume": 6066274,
        "unadjustedVolume": 6066274,
        "change": 0.36,
        "changePercent": 0.479,
        "vwap": 75.509,
        "label": "Apr 10",
        "changeOverTime": 0.015334947538337376
      },
      {
        "date": "2019-04-11",
        "open": 75.75,
        "high": 76.07,
        "low": 75.65,
        "close": 75.87,
        "volume": 6042641,
        "unadjustedVolume": 6042641,
        "change": 0.39,
        "changePercent": 0.517,
        "vwap": 75.8645,
        "label": "Apr 11",
        "changeOverTime": 0.020581113801452798
      },
      {
        "date": "2019-04-12",
        "open": 76.1,
        "high": 76.95,
        "low": 76.07,
        "close": 76.65,
        "volume": 5194754,
        "unadjustedVolume": 5194754,
        "change": 0.78,
        "changePercent": 1.028,
        "vwap": 76.614,
        "label": "Apr 12",
        "changeOverTime": 0.031073446327683645
      },
      {
        "date": "2019-04-15",
        "open": 76.67,
        "high": 76.7,
        "low": 76.08,
        "close": 76.16,
        "volume": 7632303,
        "unadjustedVolume": 7632303,
        "change": -0.49,
        "changePercent": -0.639,
        "vwap": 76.2083,
        "label": "Apr 15",
        "changeOverTime": 0.02448210922787185
      },
      {
        "date": "2019-04-16",
        "open": 76.48,
        "high": 76.56,
        "low": 75.365,
        "close": 75.7,
        "volume": 8336948,
        "unadjustedVolume": 8336948,
        "change": -0.46,
        "changePercent": -0.604,
        "vwap": 75.785,
        "label": "Apr 16",
        "changeOverTime": 0.018294323379069135
      },
      {
        "date": "2019-04-17",
        "open": 75.61,
        "high": 75.96,
        "low": 74.8,
        "close": 75.12,
        "volume": 9439007,
        "unadjustedVolume": 9439007,
        "change": -0.58,
        "changePercent": -0.766,
        "vwap": 75.0913,
        "label": "Apr 17",
        "changeOverTime": 0.010492332526230845
      },
      {
        "date": "2019-04-18",
        "open": 75.48,
        "high": 76.26,
        "low": 75.21,
        "close": 76.06,
        "volume": 6607755,
        "unadjustedVolume": 6607755,
        "change": 0.94,
        "changePercent": 1.251,
        "vwap": 75.8561,
        "label": "Apr 18",
        "changeOverTime": 0.023136938391175664
      },
      {
        "date": "2019-04-22",
        "open": 75.71,
        "high": 76.06,
        "low": 75.21,
        "close": 75.4,
        "volume": 4883100,
        "unadjustedVolume": 4883100,
        "change": -0.66,
        "changePercent": -0.868,
        "vwap": 75.5877,
        "label": "Apr 22",
        "changeOverTime": 0.01425881086898039
      },
      {
        "date": "2019-04-23",
        "open": 75.48,
        "high": 76.06,
        "low": 75.41,
        "close": 75.99,
        "volume": 5274059,
        "unadjustedVolume": 5274059,
        "change": 0.59,
        "changePercent": 0.782,
        "vwap": 75.9337,
        "label": "Apr 23",
        "changeOverTime": 0.02219531880548818
      },
      {
        "date": "2019-04-24",
        "open": 76.05,
        "high": 76.88,
        "low": 75.91,
        "close": 76.39,
        "volume": 9347260,
        "unadjustedVolume": 9347260,
        "change": 0.4,
        "changePercent": 0.526,
        "vwap": 76.4478,
        "label": "Apr 24",
        "changeOverTime": 0.0275760021522733
      },
      {
        "date": "2019-04-25",
        "open": 76.11,
        "high": 77.23,
        "low": 75.95,
        "close": 77.11,
        "volume": 11084455,
        "unadjustedVolume": 11084455,
        "change": 0.72,
        "changePercent": 0.943,
        "vwap": 76.8165,
        "label": "Apr 25",
        "changeOverTime": 0.03726123217648636
      },
      {
        "date": "2019-04-26",
        "open": 76.95,
        "high": 77.52,
        "low": 75.06,
        "close": 77.45,
        "volume": 12550458,
        "unadjustedVolume": 12550458,
        "change": 0.34,
        "changePercent": 0.441,
        "vwap": 76.75,
        "label": "Apr 26",
        "changeOverTime": 0.04183481302125369
      },
      {
        "date": "2019-04-29",
        "open": 77.3,
        "high": 77.67,
        "low": 76.59,
        "close": 76.91,
        "volume": 5426762,
        "unadjustedVolume": 5426762,
        "change": -0.54,
        "changePercent": -0.697,
        "vwap": 76.9778,
        "label": "Apr 29",
        "changeOverTime": 0.0345708905030938
      },
      {
        "date": "2019-04-30",
        "open": 77,
        "high": 77.79,
        "low": 76.69,
        "close": 77.68,
        "volume": 7384433,
        "unadjustedVolume": 7384433,
        "change": 0.77,
        "changePercent": 1.001,
        "vwap": 77.4271,
        "label": "Apr 30",
        "changeOverTime": 0.044928705945655144
      },
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
      }
    ]
  },
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
        "date": "2019-03-29",
        "open": 376.52,
        "high": 382.18,
        "low": 374.74,
        "close": 381.42,
        "volume": 7694707,
        "unadjustedVolume": 7694707,
        "change": 6.98,
        "changePercent": 1.864,
        "vwap": 379.9645,
        "label": "Mar 29",
        "changeOverTime": 0
      },
      {
        "date": "2019-04-01",
        "open": 385.8,
        "high": 392.9,
        "low": 383.1,
        "close": 391.54,
        "volume": 7735719,
        "unadjustedVolume": 7735719,
        "change": 10.12,
        "changePercent": 2.653,
        "vwap": 388.4255,
        "label": "Apr 1",
        "changeOverTime": 0.02653243144040691
      },
      {
        "date": "2019-04-02",
        "open": 388.5,
        "high": 394.8299,
        "low": 388.5,
        "close": 390.75,
        "volume": 6401023,
        "unadjustedVolume": 6401023,
        "change": -0.79,
        "changePercent": -0.202,
        "vwap": 391.624,
        "label": "Apr 2",
        "changeOverTime": 0.024461223847726872
      },
      {
        "date": "2019-04-03",
        "open": 389.68,
        "high": 391.5386,
        "low": 384.07,
        "close": 384.74,
        "volume": 7350347,
        "unadjustedVolume": 7350347,
        "change": -6.01,
        "changePercent": -1.538,
        "vwap": 386.0468,
        "label": "Apr 3",
        "changeOverTime": 0.008704315452781693
      },
      {
        "date": "2019-04-04",
        "open": 385.99,
        "high": 397.06,
        "low": 385.1,
        "close": 395.86,
        "volume": 9388082,
        "unadjustedVolume": 9388082,
        "change": 11.12,
        "changePercent": 2.89,
        "vwap": 394.5167,
        "label": "Apr 4",
        "changeOverTime": 0.03785852865607466
      },
      {
        "date": "2019-04-05",
        "open": 398.07,
        "high": 398.66,
        "low": 390.95,
        "close": 391.93,
        "volume": 6857151,
        "unadjustedVolume": 6857151,
        "change": -3.93,
        "changePercent": -0.993,
        "vwap": 393.4969,
        "label": "Apr 5",
        "changeOverTime": 0.02755492632793244
      },
      {
        "date": "2019-04-08",
        "open": 376.2,
        "high": 379.8,
        "low": 371.86,
        "close": 374.52,
        "volume": 14482604,
        "unadjustedVolume": 14482604,
        "change": -17.41,
        "changePercent": -4.442,
        "vwap": 374.8973,
        "label": "Apr 8",
        "changeOverTime": -0.018090294163913886
      },
      {
        "date": "2019-04-09",
        "open": 370.29,
        "high": 372.24,
        "low": 367.75,
        "close": 369.04,
        "volume": 7980062,
        "unadjustedVolume": 7980062,
        "change": -5.48,
        "changePercent": -1.463,
        "vwap": 369.4534,
        "label": "Apr 9",
        "changeOverTime": -0.032457658224529375
      },
      {
        "date": "2019-04-10",
        "open": 368.4,
        "high": 368.79,
        "low": 362.92,
        "close": 364.94,
        "volume": 8284959,
        "unadjustedVolume": 8284959,
        "change": -4.1,
        "changePercent": -1.111,
        "vwap": 365.1687,
        "label": "Apr 10",
        "changeOverTime": -0.043206963452362274
      },
      {
        "date": "2019-04-11",
        "open": 364.62,
        "high": 371.08,
        "low": 364.21,
        "close": 370.16,
        "volume": 6598367,
        "unadjustedVolume": 6598367,
        "change": 5.22,
        "changePercent": 1.43,
        "vwap": 368.2758,
        "label": "Apr 11",
        "changeOverTime": -0.02952126265009698
      },
      {
        "date": "2019-04-12",
        "open": 375.75,
        "high": 379.95,
        "low": 372,
        "close": 379.64,
        "volume": 7334644,
        "unadjustedVolume": 7334644,
        "change": 9.48,
        "changePercent": 2.561,
        "vwap": 377.2064,
        "label": "Apr 12",
        "changeOverTime": -0.004666771537937259
      },
      {
        "date": "2019-04-15",
        "open": 376.7,
        "high": 377.9,
        "low": 373.68,
        "close": 375.46,
        "volume": 3822079,
        "unadjustedVolume": 3822079,
        "change": -4.18,
        "changePercent": -1.101,
        "vwap": 375.9134,
        "label": "Apr 15",
        "changeOverTime": -0.015625819306800997
      },
      {
        "date": "2019-04-16",
        "open": 376.51,
        "high": 384.64,
        "low": 375.03,
        "close": 381.72,
        "volume": 7083834,
        "unadjustedVolume": 7083834,
        "change": 6.26,
        "changePercent": 1.667,
        "vwap": 379.6453,
        "label": "Apr 16",
        "changeOverTime": 0.000786534528865847
      },
      {
        "date": "2019-04-17",
        "open": 384.1,
        "high": 384.19,
        "low": 377.4837,
        "close": 377.52,
        "volume": 4424421,
        "unadjustedVolume": 4424421,
        "change": -4.2,
        "changePercent": -1.1,
        "vwap": 379.4686,
        "label": "Apr 17",
        "changeOverTime": -0.010224948875255713
      },
      {
        "date": "2019-04-18",
        "open": 377.52,
        "high": 382.17,
        "low": 377.52,
        "close": 380.07,
        "volume": 4703105,
        "unadjustedVolume": 4703105,
        "change": 2.55,
        "changePercent": 0.675,
        "vwap": 380.3688,
        "label": "Apr 18",
        "changeOverTime": -0.003539405379896237
      },
      {
        "date": "2019-04-22",
        "open": 375.69,
        "high": 378.95,
        "low": 374.9,
        "close": 375.17,
        "volume": 4147652,
        "unadjustedVolume": 4147652,
        "change": -4.9,
        "changePercent": -1.289,
        "vwap": 376.5027,
        "label": "Apr 22",
        "changeOverTime": -0.01638613601803786
      },
      {
        "date": "2019-04-23",
        "open": 375.54,
        "high": 376.87,
        "low": 372.61,
        "close": 374.02,
        "volume": 4894517,
        "unadjustedVolume": 4894517,
        "change": -1.15,
        "changePercent": -0.307,
        "vwap": 374.666,
        "label": "Apr 23",
        "changeOverTime": -0.019401185045356914
      },
      {
        "date": "2019-04-24",
        "open": 377.89,
        "high": 381.15,
        "low": 373.66,
        "close": 375.46,
        "volume": 9855141,
        "unadjustedVolume": 9855141,
        "change": 1.44,
        "changePercent": 0.385,
        "vwap": 376.9381,
        "label": "Apr 24",
        "changeOverTime": -0.015625819306800997
      },
      {
        "date": "2019-04-25",
        "open": 376.01,
        "high": 384.8,
        "low": 372.76,
        "close": 382.8,
        "volume": 6614992,
        "unadjustedVolume": 6614992,
        "change": 7.34,
        "changePercent": 1.955,
        "vwap": 379.7728,
        "label": "Apr 25",
        "changeOverTime": 0.0036180588327827472
      },
      {
        "date": "2019-04-26",
        "open": 383.89,
        "high": 384,
        "low": 378.14,
        "close": 380.79,
        "volume": 4259621,
        "unadjustedVolume": 4259621,
        "change": -2.01,
        "changePercent": -0.525,
        "vwap": 380.6974,
        "label": "Apr 26",
        "changeOverTime": -0.0016517225106182042
      },
      {
        "date": "2019-04-29",
        "open": 378.49,
        "high": 385.3,
        "low": 376.76,
        "close": 379.05,
        "volume": 5457300,
        "unadjustedVolume": 5457300,
        "change": -1.74,
        "changePercent": -0.457,
        "vwap": 381.0737,
        "label": "Apr 29",
        "changeOverTime": -0.006213622778039968
      },
      {
        "date": "2019-04-30",
        "open": 379.5,
        "high": 381.14,
        "low": 375.05,
        "close": 377.69,
        "volume": 3732809,
        "unadjustedVolume": 3732809,
        "change": -1.36,
        "changePercent": -0.359,
        "vwap": 377.2637,
        "label": "Apr 30",
        "changeOverTime": -0.00977924597556504
      },
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
        "date": "2019-03-29",
        "open": 180.73,
        "high": 182.6,
        "low": 179,
        "close": 182.45,
        "volume": 13850865,
        "unadjustedVolume": 13850865,
        "change": 4.72,
        "changePercent": 2.656,
        "vwap": 181.3169,
        "label": "Mar 29",
        "changeOverTime": 0
      },
      {
        "date": "2019-04-01",
        "open": 185.09,
        "high": 185.56,
        "low": 180.89,
        "close": 180.89,
        "volume": 12714767,
        "unadjustedVolume": 12714767,
        "change": -1.56,
        "changePercent": -0.855,
        "vwap": 183.2732,
        "label": "Apr 1",
        "changeOverTime": -0.008550287750068525
      },
      {
        "date": "2019-04-02",
        "open": 181.46,
        "high": 183.5627,
        "low": 180.95,
        "close": 181.74,
        "volume": 8021500,
        "unadjustedVolume": 8021500,
        "change": 0.85,
        "changePercent": 0.47,
        "vwap": 182.0474,
        "label": "Apr 2",
        "changeOverTime": -0.003891477117018249
      },
      {
        "date": "2019-04-03",
        "open": 179.51,
        "high": 180.7,
        "low": 176.76,
        "close": 178.32,
        "volume": 26819027,
        "unadjustedVolume": 26819027,
        "change": -3.42,
        "changePercent": -1.882,
        "vwap": 178.7158,
        "label": "Apr 3",
        "changeOverTime": -0.022636338722937768
      },
      {
        "date": "2019-04-04",
        "open": 177.04,
        "high": 181.96,
        "low": 176.89,
        "close": 181.07,
        "volume": 17002465,
        "unadjustedVolume": 17002465,
        "change": 2.75,
        "changePercent": 1.542,
        "vwap": 180.1209,
        "label": "Apr 4",
        "changeOverTime": -0.007563716086599044
      },
      {
        "date": "2019-04-05",
        "open": 182.51,
        "high": 185.5,
        "low": 182,
        "close": 185.35,
        "volume": 18705035,
        "unadjustedVolume": 18705035,
        "change": 4.28,
        "changePercent": 2.364,
        "vwap": 184.2899,
        "label": "Apr 5",
        "changeOverTime": 0.01589476568922996
      },
      {
        "date": "2019-04-08",
        "open": 184.19,
        "high": 187.82,
        "low": 184.01,
        "close": 186.5,
        "volume": 14725576,
        "unadjustedVolume": 14725576,
        "change": 1.15,
        "changePercent": 0.62,
        "vwap": 186.4333,
        "label": "Apr 8",
        "changeOverTime": 0.022197862428062546
      },
      {
        "date": "2019-04-09",
        "open": 186.49,
        "high": 187.89,
        "low": 186.16,
        "close": 187.19,
        "volume": 11578209,
        "unadjustedVolume": 11578209,
        "change": 0.69,
        "changePercent": 0.37,
        "vwap": 187.2397,
        "label": "Apr 9",
        "changeOverTime": 0.02597972047136207
      },
      {
        "date": "2019-04-10",
        "open": 186.69,
        "high": 187.4,
        "low": 184,
        "close": 186.19,
        "volume": 10655022,
        "unadjustedVolume": 10655022,
        "change": -1,
        "changePercent": -0.534,
        "vwap": 185.6384,
        "label": "Apr 10",
        "changeOverTime": 0.020498766785420713
      },
      {
        "date": "2019-04-11",
        "open": 185.15,
        "high": 186.06,
        "low": 183.75,
        "close": 184.98,
        "volume": 8900299,
        "unadjustedVolume": 8900299,
        "change": -1.21,
        "changePercent": -0.65,
        "vwap": 184.7248,
        "label": "Apr 11",
        "changeOverTime": 0.013866812825431632
      },
      {
        "date": "2019-04-12",
        "open": 187.71,
        "high": 189.79,
        "low": 187.14,
        "close": 188.91,
        "volume": 12600038,
        "unadjustedVolume": 12600038,
        "change": 3.93,
        "changePercent": 2.125,
        "vwap": 188.6424,
        "label": "Apr 12",
        "changeOverTime": 0.03540696081118119
      },
      {
        "date": "2019-04-15",
        "open": 188.06,
        "high": 188.17,
        "low": 182.56,
        "close": 183.07,
        "volume": 14616599,
        "unadjustedVolume": 14616599,
        "change": -5.84,
        "changePercent": -3.091,
        "vwap": 183.9359,
        "label": "Apr 15",
        "changeOverTime": 0.0033981912852836644
      },
      {
        "date": "2019-04-16",
        "open": 185.55,
        "high": 185.79,
        "low": 183.4,
        "close": 185.78,
        "volume": 12195911,
        "unadjustedVolume": 12195911,
        "change": 2.71,
        "changePercent": 1.48,
        "vwap": 184.9278,
        "label": "Apr 16",
        "changeOverTime": 0.018251575774184778
      },
      {
        "date": "2019-04-17",
        "open": 187.34,
        "high": 188.2,
        "low": 185.78,
        "close": 187.55,
        "volume": 11614169,
        "unadjustedVolume": 11614169,
        "change": 1.77,
        "changePercent": 0.953,
        "vwap": 187.1896,
        "label": "Apr 17",
        "changeOverTime": 0.02795286379830103
      },
      {
        "date": "2019-04-18",
        "open": 186.41,
        "high": 187.28,
        "low": 185.39,
        "close": 186.94,
        "volume": 7882495,
        "unadjustedVolume": 7882495,
        "change": -0.61,
        "changePercent": -0.325,
        "vwap": 186.4951,
        "label": "Apr 18",
        "changeOverTime": 0.02460948204987673
      },
      {
        "date": "2019-04-22",
        "open": 184.5,
        "high": 186.47,
        "low": 183.61,
        "close": 185.38,
        "volume": 8677765,
        "unadjustedVolume": 8677765,
        "change": -1.56,
        "changePercent": -0.834,
        "vwap": 185.3149,
        "label": "Apr 22",
        "changeOverTime": 0.016059194299808205
      },
      {
        "date": "2019-04-23",
        "open": 186,
        "high": 188.15,
        "low": 185.44,
        "close": 187.29,
        "volume": 11410606,
        "unadjustedVolume": 11410606,
        "change": 1.91,
        "changePercent": 1.03,
        "vwap": 187.2494,
        "label": "Apr 23",
        "changeOverTime": 0.026527815839956174
      },
      {
        "date": "2019-04-24",
        "open": 186.76,
        "high": 186.9,
        "low": 184.58,
        "close": 185.67,
        "volume": 9085262,
        "unadjustedVolume": 9085262,
        "change": -1.62,
        "changePercent": -0.865,
        "vwap": 185.5443,
        "label": "Apr 24",
        "changeOverTime": 0.017648670868731155
      },
      {
        "date": "2019-04-25",
        "open": 185.24,
        "high": 188.13,
        "low": 183.955,
        "close": 187.88,
        "volume": 10328930,
        "unadjustedVolume": 10328930,
        "change": 2.21,
        "changePercent": 1.19,
        "vwap": 186.9128,
        "label": "Apr 25",
        "changeOverTime": 0.02976157851466159
      },
      {
        "date": "2019-04-26",
        "open": 187.88,
        "high": 188.74,
        "low": 185.51,
        "close": 187.09,
        "volume": 9421120,
        "unadjustedVolume": 9421120,
        "change": -0.79,
        "changePercent": -0.42,
        "vwap": 187.2438,
        "label": "Apr 26",
        "changeOverTime": 0.025431625102767964
      },
      {
        "date": "2019-04-29",
        "open": 187.42,
        "high": 188,
        "low": 185.76,
        "close": 186.94,
        "volume": 8660640,
        "unadjustedVolume": 8660640,
        "change": -0.15,
        "changePercent": -0.08,
        "vwap": 186.9971,
        "label": "Apr 29",
        "changeOverTime": 0.02460948204987673
      },
      {
        "date": "2019-04-30",
        "open": 186.3,
        "high": 188.25,
        "low": 183.82,
        "close": 185.57,
        "volume": 15076485,
        "unadjustedVolume": 15076485,
        "change": -1.37,
        "changePercent": -0.733,
        "vwap": 185.7015,
        "label": "Apr 30",
        "changeOverTime": 0.01710057550013705
      },
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
        "date": "2019-03-29",
        "open": 84.6,
        "high": 84.85,
        "low": 83.86,
        "close": 84.21,
        "volume": 6492022,
        "unadjustedVolume": 6492022,
        "change": 0.17,
        "changePercent": 0.202,
        "vwap": 84.4061,
        "label": "Mar 29",
        "changeOverTime": 0
      },
      {
        "date": "2019-04-01",
        "open": 85.04,
        "high": 85.32,
        "low": 84.7,
        "close": 85.23,
        "volume": 6737429,
        "unadjustedVolume": 6737429,
        "change": 1.02,
        "changePercent": 1.211,
        "vwap": 85.0231,
        "label": "Apr 1",
        "changeOverTime": 0.01211257570359827
      },
      {
        "date": "2019-04-02",
        "open": 85,
        "high": 85.26,
        "low": 84.16,
        "close": 84.37,
        "volume": 4433849,
        "unadjustedVolume": 4433849,
        "change": -0.86,
        "changePercent": -1.009,
        "vwap": 84.4783,
        "label": "Apr 2",
        "changeOverTime": 0.0019000118750743477
      },
      {
        "date": "2019-04-03",
        "open": 84.9,
        "high": 84.99,
        "low": 84.25,
        "close": 84.47,
        "volume": 4080926,
        "unadjustedVolume": 4080926,
        "change": 0.1,
        "changePercent": 0.119,
        "vwap": 84.5471,
        "label": "Apr 3",
        "changeOverTime": 0.003087519296995667
      },
      {
        "date": "2019-04-04",
        "open": 84.49,
        "high": 85.38,
        "low": 84.36,
        "close": 85.28,
        "volume": 3660677,
        "unadjustedVolume": 3660677,
        "change": 0.81,
        "changePercent": 0.959,
        "vwap": 85.0022,
        "label": "Apr 4",
        "changeOverTime": 0.01270632941455893
      },
      {
        "date": "2019-04-05",
        "open": 86,
        "high": 86.16,
        "low": 85.05,
        "close": 85.4,
        "volume": 7367351,
        "unadjustedVolume": 7367351,
        "change": 0.12,
        "changePercent": 0.141,
        "vwap": 85.4262,
        "label": "Apr 5",
        "changeOverTime": 0.014131338320864648
      },
      {
        "date": "2019-04-08",
        "open": 85.01,
        "high": 85.29,
        "low": 84.57,
        "close": 84.73,
        "volume": 4705846,
        "unadjustedVolume": 4705846,
        "change": -0.67,
        "changePercent": -0.785,
        "vwap": 84.7982,
        "label": "Apr 8",
        "changeOverTime": 0.006175038593991334
      },
      {
        "date": "2019-04-09",
        "open": 84.22,
        "high": 84.6,
        "low": 83.97,
        "close": 84.28,
        "volume": 3804527,
        "unadjustedVolume": 3804527,
        "change": -0.45,
        "changePercent": -0.531,
        "vwap": 84.2741,
        "label": "Apr 9",
        "changeOverTime": 0.0008312551953450587
      },
      {
        "date": "2019-04-10",
        "open": 84.64,
        "high": 85.01,
        "low": 84.56,
        "close": 84.88,
        "volume": 3918379,
        "unadjustedVolume": 3918379,
        "change": 0.6,
        "changePercent": 0.712,
        "vwap": 84.7963,
        "label": "Apr 10",
        "changeOverTime": 0.007956299726873313
      },
      {
        "date": "2019-04-11",
        "open": 84.9,
        "high": 85.05,
        "low": 84.2837,
        "close": 85,
        "volume": 3347649,
        "unadjustedVolume": 3347649,
        "change": 0.12,
        "changePercent": 0.141,
        "vwap": 84.8385,
        "label": "Apr 11",
        "changeOverTime": 0.009381308633179033
      },
      {
        "date": "2019-04-12",
        "open": 85.3,
        "high": 86.49,
        "low": 85.29,
        "close": 86.24,
        "volume": 6037028,
        "unadjustedVolume": 6037028,
        "change": 1.24,
        "changePercent": 1.459,
        "vwap": 86.1471,
        "label": "Apr 12",
        "changeOverTime": 0.02410640066500417
      },
      {
        "date": "2019-04-15",
        "open": 86.89,
        "high": 87.2428,
        "low": 86.4388,
        "close": 86.83,
        "volume": 5035211,
        "unadjustedVolume": 5035211,
        "change": 0.59,
        "changePercent": 0.684,
        "vwap": 86.8266,
        "label": "Apr 15",
        "changeOverTime": 0.031112694454340395
      },
      {
        "date": "2019-04-16",
        "open": 87,
        "high": 87.95,
        "low": 87,
        "close": 87.8,
        "volume": 4652727,
        "unadjustedVolume": 4652727,
        "change": 0.97,
        "changePercent": 1.117,
        "vwap": 87.7064,
        "label": "Apr 16",
        "changeOverTime": 0.04263151644697784
      },
      {
        "date": "2019-04-17",
        "open": 87.95,
        "high": 88.97,
        "low": 87.45,
        "close": 88.73,
        "volume": 5694880,
        "unadjustedVolume": 5694880,
        "change": 0.93,
        "changePercent": 1.059,
        "vwap": 88.4551,
        "label": "Apr 17",
        "changeOverTime": 0.05367533547084682
      },
      {
        "date": "2019-04-18",
        "open": 88.76,
        "high": 90,
        "low": 88.7,
        "close": 89.2,
        "volume": 7016564,
        "unadjustedVolume": 7016564,
        "change": 0.47,
        "changePercent": 0.53,
        "vwap": 89.3568,
        "label": "Apr 18",
        "changeOverTime": 0.059256620353877326
      },
      {
        "date": "2019-04-22",
        "open": 88.35,
        "high": 88.64,
        "low": 87.3,
        "close": 87.36,
        "volume": 5390519,
        "unadjustedVolume": 5390519,
        "change": -1.84,
        "changePercent": -2.063,
        "vwap": 87.8491,
        "label": "Apr 22",
        "changeOverTime": 0.03740648379052376
      },
      {
        "date": "2019-04-23",
        "open": 87.57,
        "high": 87.67,
        "low": 87.0092,
        "close": 87.43,
        "volume": 7513959,
        "unadjustedVolume": 7513959,
        "change": 0.07,
        "changePercent": 0.08,
        "vwap": 87.2808,
        "label": "Apr 23",
        "changeOverTime": 0.03823773898586882
      },
      {
        "date": "2019-04-24",
        "open": 87.67,
        "high": 88.8241,
        "low": 87.43,
        "close": 88.39,
        "volume": 8062966,
        "unadjustedVolume": 8062966,
        "change": 0.96,
        "changePercent": 1.098,
        "vwap": 88.3364,
        "label": "Apr 24",
        "changeOverTime": 0.04963781023631406
      },
      {
        "date": "2019-04-25",
        "open": 88.4,
        "high": 88.54,
        "low": 87.49,
        "close": 87.56,
        "volume": 7069867,
        "unadjustedVolume": 7069867,
        "change": -0.83,
        "changePercent": -0.939,
        "vwap": 88.0459,
        "label": "Apr 25",
        "changeOverTime": 0.03978149863436657
      },
      {
        "date": "2019-04-26",
        "open": 87.95,
        "high": 88.94,
        "low": 87.33,
        "close": 88.31,
        "volume": 6219557,
        "unadjustedVolume": 6219557,
        "change": 0.75,
        "changePercent": 0.857,
        "vwap": 88.3862,
        "label": "Apr 26",
        "changeOverTime": 0.04868780429877697
      },
      {
        "date": "2019-04-29",
        "open": 88.18,
        "high": 88.505,
        "low": 88.13,
        "close": 88.26,
        "volume": 5008453,
        "unadjustedVolume": 5008453,
        "change": -0.05,
        "changePercent": -0.057,
        "vwap": 88.3144,
        "label": "Apr 29",
        "changeOverTime": 0.048094050587816316
      },
      {
        "date": "2019-04-30",
        "open": 88.29,
        "high": 88.4,
        "low": 87.26,
        "close": 87.83,
        "volume": 7614083,
        "unadjustedVolume": 7614083,
        "change": -0.43,
        "changePercent": -0.487,
        "vwap": 87.7097,
        "label": "Apr 30",
        "changeOverTime": 0.042987768673554264
      },
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
      }
    ]
  },
  "AMZN": {
    "chart": [
      {
        "date": "2019-03-29",
        "open": 1786.58,
        "high": 1792.86,
        "low": 1776.63,
        "close": 1780.75,
        "volume": 3320793,
        "unadjustedVolume": 3320793,
        "change": 7.33,
        "changePercent": 0.413,
        "vwap": 1782.85,
        "label": "Mar 29",
        "changeOverTime": 0
      },
      {
        "date": "2019-04-01",
        "open": 1800.11,
        "high": 1815.67,
        "low": 1798.73,
        "close": 1814.19,
        "volume": 4238752,
        "unadjustedVolume": 4238752,
        "change": 33.44,
        "changePercent": 1.878,
        "vwap": 1808.72,
        "label": "Apr 1",
        "changeOverTime": 0.018778604520567208
      },
      {
        "date": "2019-04-02",
        "open": 1811.02,
        "high": 1820,
        "low": 1805.12,
        "close": 1813.98,
        "volume": 3448115,
        "unadjustedVolume": 3448115,
        "change": -0.21,
        "changePercent": -0.012,
        "vwap": 1813.4,
        "label": "Apr 2",
        "changeOverTime": 0.018660676681173674
      },
      {
        "date": "2019-04-03",
        "open": 1826.72,
        "high": 1830,
        "low": 1809.62,
        "close": 1820.7,
        "volume": 3980590,
        "unadjustedVolume": 3980590,
        "change": 6.72,
        "changePercent": 0.37,
        "vwap": 1822.69,
        "label": "Apr 3",
        "changeOverTime": 0.022434367541766136
      },
      {
        "date": "2019-04-04",
        "open": 1820.65,
        "high": 1828.75,
        "low": 1804.2,
        "close": 1818.86,
        "volume": 3623867,
        "unadjustedVolume": 3623867,
        "change": -1.84,
        "changePercent": -0.101,
        "vwap": 1817.38,
        "label": "Apr 4",
        "changeOverTime": 0.021401095044222884
      },
      {
        "date": "2019-04-05",
        "open": 1829,
        "high": 1838.58,
        "low": 1825.19,
        "close": 1837.28,
        "volume": 3640476,
        "unadjustedVolume": 3640476,
        "change": 18.42,
        "changePercent": 1.013,
        "vwap": 1833.09,
        "label": "Apr 5",
        "changeOverTime": 0.031745051242454005
      },
      {
        "date": "2019-04-08",
        "open": 1833.23,
        "high": 1850.2,
        "low": 1825.11,
        "close": 1849.86,
        "volume": 3752841,
        "unadjustedVolume": 3752841,
        "change": 12.58,
        "changePercent": 0.685,
        "vwap": 1837.24,
        "label": "Apr 8",
        "changeOverTime": 0.03880949038326542
      },
      {
        "date": "2019-04-09",
        "open": 1845.49,
        "high": 1853.09,
        "low": 1831.78,
        "close": 1835.84,
        "volume": 3714368,
        "unadjustedVolume": 3714368,
        "change": -14.02,
        "changePercent": -0.758,
        "vwap": 1843.56,
        "label": "Apr 9",
        "changeOverTime": 0.030936403200898452
      },
      {
        "date": "2019-04-10",
        "open": 1841,
        "high": 1848,
        "low": 1828.81,
        "close": 1847.33,
        "volume": 2963973,
        "unadjustedVolume": 2963973,
        "change": 11.49,
        "changePercent": 0.626,
        "vwap": 1841.04,
        "label": "Apr 10",
        "changeOverTime": 0.03738874069914358
      },
      {
        "date": "2019-04-11",
        "open": 1848.7,
        "high": 1849.95,
        "low": 1840.31,
        "close": 1844.07,
        "volume": 2654842,
        "unadjustedVolume": 2654842,
        "change": -3.26,
        "changePercent": -0.176,
        "vwap": 1844.96,
        "label": "Apr 11",
        "changeOverTime": 0.03555805138284427
      },
      {
        "date": "2019-04-12",
        "open": 1848.4,
        "high": 1851.5,
        "low": 1841.3,
        "close": 1843.06,
        "volume": 3114413,
        "unadjustedVolume": 3114413,
        "change": -1.01,
        "changePercent": -0.055,
        "vwap": 1846.25,
        "label": "Apr 12",
        "changeOverTime": 0.034990874631475474
      },
      {
        "date": "2019-04-15",
        "open": 1842,
        "high": 1846.85,
        "low": 1818.9,
        "close": 1844.87,
        "volume": 3724423,
        "unadjustedVolume": 3724423,
        "change": 1.81,
        "changePercent": 0.098,
        "vwap": 1835.71,
        "label": "Apr 15",
        "changeOverTime": 0.036007300294819536
      },
      {
        "date": "2019-04-16",
        "open": 1851.35,
        "high": 1869.77,
        "low": 1848,
        "close": 1863.04,
        "volume": 3044618,
        "unadjustedVolume": 3044618,
        "change": 18.17,
        "changePercent": 0.985,
        "vwap": 1860.28,
        "label": "Apr 16",
        "changeOverTime": 0.04621086620805838
      },
      {
        "date": "2019-04-17",
        "open": 1872.99,
        "high": 1876.47,
        "low": 1860.44,
        "close": 1864.82,
        "volume": 2893517,
        "unadjustedVolume": 2893517,
        "change": 1.78,
        "changePercent": 0.096,
        "vwap": 1867.22,
        "label": "Apr 17",
        "changeOverTime": 0.04721044503720339
      },
      {
        "date": "2019-04-18",
        "open": 1868.79,
        "high": 1870.82,
        "low": 1859.48,
        "close": 1861.69,
        "volume": 2749882,
        "unadjustedVolume": 2749882,
        "change": -3.13,
        "changePercent": -0.168,
        "vwap": 1864.43,
        "label": "Apr 18",
        "changeOverTime": 0.04545275866910013
      },
      {
        "date": "2019-04-22",
        "open": 1855.4,
        "high": 1888.42,
        "low": 1845.64,
        "close": 1887.31,
        "volume": 3373807,
        "unadjustedVolume": 3373807,
        "change": 25.62,
        "changePercent": 1.376,
        "vwap": 1873.96,
        "label": "Apr 22",
        "changeOverTime": 0.059839955075108774
      },
      {
        "date": "2019-04-23",
        "open": 1891.2,
        "high": 1929.26,
        "low": 1889.58,
        "close": 1923.77,
        "volume": 4640441,
        "unadjustedVolume": 4640441,
        "change": 36.46,
        "changePercent": 1.932,
        "vwap": 1915.75,
        "label": "Apr 23",
        "changeOverTime": 0.0803144742383827
      },
      {
        "date": "2019-04-24",
        "open": 1925,
        "high": 1929.69,
        "low": 1898.16,
        "close": 1901.75,
        "volume": 3675781,
        "unadjustedVolume": 3675781,
        "change": -22.02,
        "changePercent": -1.145,
        "vwap": 1913.95,
        "label": "Apr 24",
        "changeOverTime": 0.06794889793626281
      },
      {
        "date": "2019-04-25",
        "open": 1917,
        "high": 1922.45,
        "low": 1900.31,
        "close": 1902.25,
        "volume": 6099101,
        "unadjustedVolume": 6099101,
        "change": 0.5,
        "changePercent": 0.026,
        "vwap": 1912.31,
        "label": "Apr 25",
        "changeOverTime": 0.06822967850624737
      },
      {
        "date": "2019-04-26",
        "open": 1929,
        "high": 1951,
        "low": 1898,
        "close": 1950.63,
        "volume": 8432563,
        "unadjustedVolume": 8432563,
        "change": 48.38,
        "changePercent": 2.543,
        "vwap": 1928.58,
        "label": "Apr 26",
        "changeOverTime": 0.09539800645795317
      },
      {
        "date": "2019-04-29",
        "open": 1949,
        "high": 1956.34,
        "low": 1934.09,
        "close": 1938.43,
        "volume": 4021255,
        "unadjustedVolume": 4021255,
        "change": -12.2,
        "changePercent": -0.625,
        "vwap": 1944.12,
        "label": "Apr 29",
        "changeOverTime": 0.08854696055032996
      },
      {
        "date": "2019-04-30",
        "open": 1930.1,
        "high": 1935.71,
        "low": 1906.95,
        "close": 1926.52,
        "volume": 3506007,
        "unadjustedVolume": 3506007,
        "change": -11.91,
        "changePercent": -0.614,
        "vwap": 1923.67,
        "label": "Apr 30",
        "changeOverTime": 0.08185876737329775
      },
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

var yest_exchange_rate_mock_data = {
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
}

var exchange_rate_mock_data = {
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