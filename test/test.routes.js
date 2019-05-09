const request = require('supertest');
const assert = require('chai').assert;
const expect = require('chai').expect;
var should = require('chai').should();
var cheerio = require('cheerio');
var chai = require('chai'), chaiHttp = require('chai-http');

chai.use(chaiHttp);
const app = require('../project');
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
          .set('Accept', 'application/json')
          .expect('Content-Type', "text/html; charset=utf-8")
          .expect(200)
          .end(function(err, res) {
            var $ = cheerio.load(res.text);
          //   console.log(res.text)
            var title = $('form > h1').text();
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
        .expect(200)
        // Only way to see what was returned (as far as I know) is to use .end and a callback
        .end(function(err, res) {
        // res is the app's response for the end point (whatever page gave for response.render() or response.send())
        // Console.log(res) 

        var $ = cheerio.load(res.text);
        var title = $('form > h1').text();
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
          .expect(200)
          .end(function(err, res) {
            assert.equal(res.text, '')
            done()
          })
  });
});

describe('GET /register', function () {
  it("should return webpage with title of 'To create an account please enter credentials.' ", function (done) {
      request(app)
          .get('/register')
          .set('Accept', 'application/json')
          .expect('Content-Type', "text/html; charset=utf-8")
          .expect(200)
          .end(function(err, res) {
            var $ = cheerio.load(res.text);
            var title = $('form > h1').text();
            assert.equal(title, "To create an account please enter credentials.")
            done()
          })
  });
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
                // console.log(res.text)
                // var $ = cheerio.load(res.text);
                // var title = $('div[role=alert]').text();
                // var display = $('title').text();

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
            console.log(res.text)
            // var $ = cheerio.load(res.text);
            // var title = $('div[role=alert]').text();
            // var display = $('title').text();

            // assert.equal(title, "Welcome to the trading page.");
            // assert.equal(display, "Trading");
            // expect(res).to.have.status(200);
              done()
          });
      });
  });
});
