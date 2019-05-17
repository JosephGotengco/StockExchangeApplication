process.env.NODE_ENV = "test";

const DB_URI = "mongodb://localhost:27017/accounts";
// const DB_URI = "mongodb+srv://JosephG:TPSGqjYl9FxhStok@stockexchangeapplication-mdhwe.mongodb.net/accounts";

const request = require("supertest");
const assert = require("chai").assert;
const expect = require("chai").expect;
var should = require("chai").should;
var cheerio = require("cheerio");
const nock = require("nock");
var moment = require("moment");
const mongoose = require("mongoose");



var chai = require("chai"),
    chaiHttp = require("chai-http");

chai.use(chaiHttp);

const app = require("../project");
const utils = require("../utils");

beforeEach(() => {
    nock("https://ws-api.iextrading.com")
        .get(
            "/1.0/stock/market/batch?symbols=NFLX,AAPL,TSLA,GOOG,SBUX,FB,BA,BABA,NKE,AMZN&types=chart&range=1m"
        )
        .reply(200, reg_mock_data);
});

beforeEach(() => {
    nock("https://api.exchangeratesapi.io")
        .get("/latest?base=USD")
        .reply(200, exchange_rate_mock_data);
});

var yesterday = moment().subtract(2, "days");
var date = yesterday.format("YYYY-MM-DD");

beforeEach(() => {
    nock("https://api.exchangeratesapi.io")
        .get(`/${date}?base=USD`)
        .reply(200, yest_exchange_rate_mock_data);
});

beforeEach(() => {
    nock("https://cloud.iexapis.com")
        .get(`/beta/stock/FB/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`)
        .reply(200, fb_mock_data);
});

beforeEach(() => {
    nock("https://cloud.iexapis.com")
        .get(`/beta/stock/RANDOM TICKER/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`)
        .reply(200, "Unknown symbol");
});

beforeEach(() => {
    nock("https://ws-api.iextrading.com")
        .get("/1.0/stock/market/batch?symbols=FB,&types=chart&range=1m&last=5")
        .reply(200, closing_fb_price)
});

beforeEach(() => {
    nock("https://cloud.iexapis.com")
    .get("/beta/stock/SNAP/quote?token=sk_291eaf03571b4f0489b0198ac1af487d")
    .reply(200, closing_snap_price)
})


const Fixtures = require("node-mongodb-fixtures");
const uri = DB_URI;
const options = null;

const fixtures = new Fixtures({
    dir: "test/fixtures",
    filter: ".*"
});


fixtures
    .connect(DB_URI)
    .then(() => fixtures.unload())
    .then(() => fixtures.load())
    .catch(e => console.error(e))
    .finally(() => fixtures.disconnect());


describe("Routing tests", function () {
    var agent = chai.request.agent(app);
    describe("GET /unknown-endpoint", function () {
        it("should return 400 response", function (done) {
            request(app)
                .get("/unknown-endpoint")
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("form > p").text();
                    assert.equal(
                        title,
                        "Sorry the URL 'localhost:8080/unknown-endpoint' does not exist."
                    );
                    done();
                });
        });

        it("should login and return 400 response", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/unknown-endpoint").then(function (res) {
                        expect(res).to.have.status(400);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("form > p").text();
                        assert.equal(
                            title,
                            "Sorry the URL 'localhost:8080/unknown-endpoint' does not exist."
                        );
                        done();
                    });
                });
        });
    });

    describe('/registration-logged-in', () => {
        it("should login and go to register page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/registration-logged-in").then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("div[role=alert]").text();
                        var display = $("title").text();
                        assert.equal(title, "You are already logged in. Logout to make a new account.");
                        assert.equal(display, "Register");
                        done();
                    });
                });
        });
    });


    describe("GET/POST /register", function () {

        it("should go to register page", function (done) {
            request(app)
                .get("/register")
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("div > h1").text();
                    assert.equal(title, "To create an account please enter credentials.");
                    done();
                });
        });

        it("should attempt to register with empty firstname field", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "",
                    lastname: "validLastname",
                    username: "validUsername",
                    password: "validPassword",
                    confirm_password: "validPassword",
                    s1Q: "What primary school did you attend?",
                    s1A: "Selkirk",
                    s2Q: "What time of the day were you born? (hh:mm)",
                    s2A: "24:24"
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(
                        title,
                        "First name must be 3-30 characters long and must only contain letters."
                    );
                    done();
                });
        });

        it("should attempt to register with empty lastname field", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "validFirstname",
                    lastname: "",
                    username: "validUsername",
                    password: "validPassword",
                    confirm_password: "validPassword",
                    s1Q: "What primary school did you attend?",
                    s1A: "Selkirk",
                    s2Q: "What time of the day were you born? (hh:mm)",
                    s2A: "24:24"
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(
                        title,
                        "Last name must be 3-30 characters long and must only contain letters."
                    );
                    done();
                });
        });

        it("should attempt to register with empty username field", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "validFirstname",
                    lastname: "validLastname",
                    username: "",
                    password: "validPassword",
                    confirm_password: "validPassword",
                    s1Q: "What primary school did you attend?",
                    s1A: "Selkirk",
                    s2Q: "What time of the day were you born? (hh:mm)",
                    s2A: "24:24"
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(
                        title,
                        "Username must have 5-15 characters and may only be alphanumeric."
                    );
                    done();
                });
        });

        it("should attempt to register with empty password field", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "validFirstname",
                    lastname: "validLastname",
                    username: "validUsername",
                    password: "",
                    confirm_password: "validPassword",
                    s1Q: "What primary school did you attend?",
                    s1A: "Selkirk",
                    s2Q: "What time of the day were you born? (hh:mm)",
                    s2A: "24:24"
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(
                        title,
                        "Password must have 5-15 characters and may only be alphanumeric."
                    );
                    done();
                });
        });

        it("should attempt to resgister with non-matching passwords", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "validFirstname",
                    lastname: "validLastname",
                    username: "validUsername",
                    password: "validPassword",
                    confirm_password: "",
                    s1Q: "What primary school did you attend?",
                    s1A: "Selkirk",
                    s2Q: "What time of the day were you born? (hh:mm)",
                    s2A: "24:24"
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(title, "Passwords do not match. Please try again.");
                    done();
                });
        });

        it("should attempt to register without picking the first security question", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "validFirstname",
                    lastname: "validLastname",
                    username: "validUsername",
                    password: "validPassword",
                    confirm_password: "validPassword",
                    s1Q: "",
                    s1A: "Selkirk",
                    s2Q: "What time of the day were you born? (hh:mm)",
                    s2A: "24:24"
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(title, "Please pick and answer the first security question.");
                    done();
                });
        });

        it("should attempt to resgister without answering their first security question", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "validFirstname",
                    lastname: "validLastname",
                    username: "validUsername",
                    password: "validPassword",
                    confirm_password: "validPassword",
                    s1Q: "What primary school did you attend?",
                    s1A: "",
                    s2Q: "What time of the day were you born? (hh:mm)",
                    s2A: "24:24"
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(title, "Your answer for security question #1 must have 5-15 characters and may only be alphanumeric.");
                    done();
                });
        });

        it("should attempt to resgister without picking the second security question", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "validFirstname",
                    lastname: "validLastname",
                    username: "validUsername",
                    password: "validPassword",
                    confirm_password: "validPassword",
                    s1Q: "What primary school did you attend?",
                    s1A: "Selkirk",
                    s2Q: "",
                    s2A: "24:24"
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(title, "Please pick and answer a second security question.");
                    done();
                });
        });

        it("should attempt to resgister without answering their first security question", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "validFirstname",
                    lastname: "validLastname",
                    username: "validUsername",
                    password: "validPassword",
                    confirm_password: "validPassword",
                    s1Q: "What primary school did you attend?",
                    s1A: "Selkirk",
                    s2Q: "What time of the day were you born? (hh:mm)",
                    s2A: ""
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(title, "Your answer for security question #2 must have 5-15 characters and may only be alphanumeric.");
                    done();
                });
        });

        it("should register successfully", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "validFirstname",
                    lastname: "validLastname",
                    username: "validUsername",
                    password: "validPassword",
                    confirm_password: "validPassword",
                    s1Q: "What primary school did you attend?",
                    s1A: "Selkirk",
                    s2Q: "What time of the day were you born? (hh:mm)",
                    s2A: "24:24"
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(
                        title,
                        "You have successfully created an account with the username 'validUsername' and have been granted $10,000 USD. Head over to the login page."
                    );
                    done();
                });
        });

        it("should attempt to register with a pre-existing account (based on username)", function (done) {
            request(app)
                .post("/register")
                .send({
                    _method: "post",
                    firstname: "validFirstname",
                    lastname: "validLastname",
                    username: "validUsername",
                    password: "validPassword",
                    confirm_password: "validPassword",
                    s1Q: "What primary school did you attend?",
                    s1A: "Selkirk",
                    s2Q: "What time of the day were you born? (hh:mm)",
                    s2A: "24:24"
                })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(
                        title,
                        "The username 'validUsername' already exists within the system."
                    );
                    done();
                });
        });
    });



    describe("GET/POST /", function () {
        it("should go to login page ", function (done) {
            request(app)
                .get("/")
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("div > h1").text();
                    assert.equal(title, "Welcome to the login page.");
                    done();
                });
        });

        it("should log in and access trading page", function (done) {
            agent
                .post("/")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/trading-success").then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("div[role=alert]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the trading page.");
                        assert.equal(display, "Trading");
                        done();
                    });
                });
        });

        it("should attempt to log in with invalid username and access trading page", function (done) {
            agent
                .post("/")
                .send({
                    _method: "post",
                    username: "Invalid Username",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/trading-success").then(function (res) {
                        expect(res).to.redirect;
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("h1[class=title]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the login page.");
                        assert.equal(display, "Login");
                        done();
                    });
                });
        });

    });


    var agent = chai.request.agent(app);
    describe("POST /login", function () {
        it("Should go to login page", function (done) {
            request(app)
                .get("/login")
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("h1[class=title]").text();
                    assert.equal(
                        title,
                        "Welcome to the login page."
                    );
                    done();
                });
        });

        it("should log in with invalid username and access trading page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/trading-success").then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("div[role=alert]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the trading page.");
                        assert.equal(display, "Trading");
                        done();
                    });
                });
        });

        it("should attempt to log in with invalid username and access trading page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "Invalid Username",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/trading-success").then(function (res) {
                        expect(res).to.redirect;
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("h1[class=title]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the login page.");
                        assert.equal(display, "Login");
                        done();
                    });
                });
        });

        it("should attempt to log in with invalid password and access trading page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Invalid password"
                })
                .then(function (res) {
                    return agent.get("/trading-success").then(function (res) {
                        expect(res).to.redirect;
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("h1[class=title]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the login page.");
                        assert.equal(display, "Login");
                        done();
                    });
                });
        });
    });



    var agent = chai.request.agent(app);
    describe("GET/POST /login", function () {
        it("should log in and access the trading page", function (done) {
            agent
                .post("/login-fail")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/trading-success").then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("div[role=alert]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the trading page.");
                        assert.equal(display, "Trading");
                        done();
                    });
                });
        });

        it("should attempt to log in with invalid username and access trading page", function (done) {
            agent
                .post("/login-fail")
                .send({
                    _method: "post",
                    username: "Invalid Username",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/trading-success").then(function (res) {
                        expect(res).to.redirect;
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("h1[class=title]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the login page.");
                        assert.equal(display, "Login");
                        done();
                    });
                });
        });

        it("should attempt to log in with invalid password and access trading page", function (done) {
            agent
                .post("/login-fail")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Invalid password"
                })
                .then(function (res) {
                    return agent.get("/trading-success").then(function (res) {
                        expect(res).to.redirect;
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("h1[class=title]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the login page.");
                        assert.equal(display, "Login");
                        done();
                    });
                });
        });
    });


    describe("GET /logout", function () {
        it("should logout", function (done) {
            request(app)
                .get("/logout")
                .set("Accept", "application/json")
                .end(function (err, res) {
                    expect(res).to.redirect;
                    expect(res).to.have.status(302);
                    expect(res).to.redirectTo('/');
                    assert.equal(res.text, "");
                    done();
                });
        });
    });









    describe("GET /news-hub", function () {
        it("should log in and access news-hub page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/news-hub").then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        // STOCK TESTING
                        var nflx_patt = /NFLX/;
                        assert.isTrue(nflx_patt.test(res.text));
                        var aapl_patt = /AAPL/;
                        assert.isTrue(aapl_patt.test(res.text));
                        var tsla_patt = /TSLA/;
                        assert.isTrue(tsla_patt.test(res.text));
                        var goog_patt = /GOOG/;
                        assert.isTrue(goog_patt.test(res.text));
                        var sbux_patt = /SBUX/;
                        assert.isTrue(sbux_patt.test(res.text));
                        var fb_patt = /FB/;
                        assert.isTrue(fb_patt.test(res.text));
                        var ba_patt = /BA/;
                        assert.isTrue(ba_patt.test(res.text));
                        var baba_patt = /BABA/;
                        assert.isTrue(baba_patt.test(res.text));
                        var nke_patt = /NKE/;
                        assert.isTrue(nke_patt.test(res.text));
                        var amzn_patt = /AMZN/;
                        assert.isTrue(amzn_patt.test(res.text));
                        // CURRENCY TESTING
                        var cad_patt = /CAD/;
                        assert.isTrue(cad_patt.test(res.text));
                        var bgn_patt = /BGN/;
                        assert.isTrue(bgn_patt.test(res.text));
                        var eur_patt = /EUR/;
                        assert.isTrue(eur_patt.test(res.text));
                        var jpy_patt = /JPY/;
                        assert.isTrue(jpy_patt.test(res.text));
                        var aud_patt = /AUD/;
                        assert.isTrue(aud_patt.test(res.text));
                        var hkd_patt = /HKD/;
                        assert.isTrue(hkd_patt.test(res.text));
                        var gbp_patt = /GBP/;
                        assert.isTrue(gbp_patt.test(res.text));
                        var mxn_patt = /MXN/;
                        assert.isTrue(mxn_patt.test(res.text));
                        var inr_patt = /INR/;
                        assert.isTrue(inr_patt.test(res.text));
                        var cny_patt = /CNY/;
                        assert.isTrue(cny_patt.test(res.text));
                        done();
                    });
                });
        });

        it("should log in and change currency on the news-hub page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.post("/news-hub").then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("title").text();
                        assert.equal(title, "Ranking");
                        done();
                    });
                });
        });
    });



    describe("GET /trading", function () {
        it("should attempt to access trading page while not logged in", function (done) {
            request(app)
                .get("/trading")
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("div[role=alert]").text();
                    assert.equal(
                        title,
                        "You are not logged in. You must be logged in to view this page."
                    );
                    done();
                });
        });
    });


    var agent = chai.request.agent(app);
    describe("POST /login", function () {
        it("should log in and should change marquee data", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.post("/trading-success-stocks").then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("div[role=alert]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the trading page.");
                        assert.equal(display, "Trading");
                        done();
                    });
                });
        });

        it("should log in and change the currency on the trading success page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "tester",
                    password: "tester"
                })
                .then(function (res) {
                    return agent.post("/convert/currency")
                    .send({
                        _method: "post",
                        currency_preference: "JPY"
                    })
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("div[role=alert]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the trading page.");
                        assert.equal(display, "Trading");
                        done();
                    });
                });
        });

        it("should log in and change the currency on the trading success page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.post("/trading-success-currency")
                    .send({
                        _method: "post",
                        currency_preference: "JPY"
                    })
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("div[role=alert]").text();
                        var display = $("title").text();
                        assert.equal(title, "Welcome to the trading page.");
                        assert.equal(display, "Trading");
                        done();
                    });
                });
        });
    });


    var agent = chai.request.agent(app);
    describe("GET /news/currency/:id", function () {
        it("should login and access a currency graph", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/news/currency/CAD").then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var display = $("title").text();
                        assert.equal(display, "CAD Price");
                        var patt = /compared to USD/;
                        assert.isTrue(patt.test(res.text));
                        done();
                    });
                });
        });
    });

    describe("GET /news/stock/:id", function () {
        it("should login and access a stock graph", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.get("/news/stock/FB").then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var display = $("title").text();
                        assert.equal(display, "FB Price");
                        var patt = /compared to USD/;
                        assert.isTrue(patt.test(res.text));
                        done();
                    });
                });
        });
    });

    var agent = chai.request.agent(app);
    describe("POST /trading-success-search", function () {
        it("should login, change marquee to stock data, and search for a stock", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    agent.post("/trading-success-stocks")
                        .then(function (res) {
                            return agent.post("/trading-success-search")
                                .send({
                                    _method: "post",
                                    stocksearch: "FB"
                                })
                                .then(function (res) {
                                    expect(res).to.have.status(200);
                                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                                    var $ = cheerio.load(res.text);
                                    var title = $("div[role=alert]").text();
                                    var display = $("title").text();
                                    assert.equal(title, "The price of the selected ticker \'FB\' which belongs to \'Facebook, Inc.\' is currently: $195.47 USD.");
                                    assert.equal(display, "Trading");
                                    done();
                                });
                        })

                });
        });

        it("should login and attempt to search for a stock with an empty stocksearch field", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.post("/trading-success-search")
                        .send({
                            _method: "post",
                            stocksearch: ""
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "Please enter a stock ticker i.e. TSLA, MSFT");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });

        it("shoud log in and search for a stock with a invalid ticker", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.post("/trading-success-search")
                        .send({
                            _method: "post",
                            stocksearch: "Random Ticker"
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "Sorry the stock ticker \'RANDOM TICKER\' is invalid.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });

        it("should login and search for a valid ticker", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "tester",
                    password: "tester"
                })
                .then(function (res) {
                    agent.post("/trading-success-stocks")
                        .then(function (res) {
                            return agent.post("/trading-success-search")
                                .send({
                                    _method: "post",
                                    stocksearch: "FB"
                                })
                                .then(function (res) {
                                    expect(res).to.have.status(200);
                                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                                    var $ = cheerio.load(res.text);
                                    var title = $("div[role=alert]").text();
                                    var display = $("title").text();
                                    assert.equal(title, "The price of the selected ticker \'FB\' which belongs to \'Facebook, Inc.\' is currently: $195.47 USD.");
                                    assert.equal(display, "Trading");
                                    done();
                                });
                        });
                });
        });
    });




    var agent = chai.request.agent(app);
    describe("POST /trading-success-buy", function () {
        it("should login and buy a stock", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.post("/trading-success-buy")
                        .send({
                            _method: "post",
                            buystockticker: "FB",
                            buystockqty: 1
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "You successfully purchased 1 shares of Facebook, Inc. (FB) at $195.47/share for $195.47.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });

        it("should login and buy 0 stocks", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.post("/trading-success-buy")
                        .send({
                            _method: "post",
                            buystockticker: "FB",
                            buystockqty: 0
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "Sorry you need to purchase at least 1 stock. Change your quantity to 1 or more.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });

        it("should login and buy a negative amount of stocks", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    return agent.post("/trading-success-buy")
                        .send({
                            _method: "post",
                            buystockticker: "FB",
                            buystockqty: -1
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "You cannot buy negative shares.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });


        it("should login and attempt to buy a stock with insufficent funds", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JimmyT",
                    password: "Claire"
                })
                .then(function (res) {
                    return agent.post("/trading-success-buy")
                        .send({
                            _method: "post",
                            buystockticker: "FB",
                            buystockqty: 1
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "Sorry you only have $0.00. The purchase did not go through. The total cost was $195.47.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });

        it("should login and attempt to buy a stock with an empty buystockticker field", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JimmyT",
                    password: "Claire"
                })
                .then(function (res) {
                    return agent.post("/trading-success-buy")
                        .send({
                            _method: "post",
                            buystockticker: "",
                            buystockqty: 1
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "Sorry, you must input a stock to buy.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });

        it("should login and attempt to buy a stock with an invalid ticker", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JimmyT",
                    password: "Claire"
                })
                .then(function (res) {
                    agent.post("/trading-success-stocks")
                        .then(function (res) {
                            return agent.post("/trading-success-buy")
                                .send({
                                    _method: "post",
                                    buystockticker: "Random Ticker",
                                    buystockqty: 1
                                })
                                .then(function (res) {
                                    expect(res).to.have.status(200);
                                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                                    var $ = cheerio.load(res.text);
                                    var title = $("div[role=alert]").text();
                                    var display = $("title").text();
                                    assert.equal(title, "Sorry the stock ticker \'Random Ticker\' is invalid.");
                                    assert.equal(display, "Trading");
                                    done();
                                });
                        });
                });
        });
    });





    var agent = chai.request.agent(app);
    describe("POST /trading-success-sell#1", function () {
        it("should login and sell a stock", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "AlexC",
                    password: "LeagueOfLegends"
                })
                .then(function (res) {
                    return agent.post("/trading-success-sell")
                        .send({
                            _method: "post",
                            sellstockticker: "FB",
                            sellstockqty: 1
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "You successfully sold 1 shares of Facebook, Inc. (FB) at $195.47/share for $195.47.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });

        it("should login and attempt to sell 0 stocks", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "AlexC",
                    password: "LeagueOfLegends"
                })
                .then(function (res) {
                    return agent.post("/trading-success-sell")
                        .send({
                            _method: "post",
                            sellstockticker: "FB",
                            sellstockqty: 0
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "You need to sell at least 1 share of FB.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });

        it("should login and attempt to sell more stocks than user has", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "tester",
                    password: "tester"
                })
                .then(function (res) {
                    return agent.post("/trading-success-sell")
                        .send({
                            _method: "post",
                            sellstockticker: "FB",
                            sellstockqty: 100
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "You are trying to sell 100 shares of FB when you only have 5 shares.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });


        it("should login and attempt to sell a stock that user does not have", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "AlexC",
                    password: "LeagueOfLegends"
                })
                .then(function (res) {
                    return agent.post("/trading-success-sell")
                        .send({
                            _method: "post",
                            sellstockticker: "SNAP",
                            sellstockqty: 1
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "You do not own any shares with the ticker \'SNAP\'.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });


        it("should login and attempt to sell a stock with an empty sellstockticker field", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "AlexC",
                    password: "LeagueOfLegends"
                })
                .then(function (res) {
                    agent.post("/trading-success-stocks")
                        .then(function (res) {
                            return agent.post("/trading-success-sell")
                                .send({
                                    _method: "post",
                                    sellstockticker: "",
                                    sellstockqty: 1
                                })
                                .then(function (res) {
                                    expect(res).to.have.status(200);
                                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                                    var $ = cheerio.load(res.text);
                                    var title = $("div[role=alert]").text();
                                    var display = $("title").text();
                                    assert.equal(title, "You cannot leave the sell input blank. Please input a stock ticker");
                                    assert.equal(display, "Trading");
                                    done();
                                });
                        });
                });
        });
    });




    var agent = chai.request.agent(app);
    describe("POST /trading-success-sell#2", function () {
        it("should login and sell a stock", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "AlexC",
                    password: "LeagueOfLegends"
                })
                .then(function (res) {
                    return agent.post("/trading-success-sell")
                        .send({
                            _method: "post",
                            sellstockticker: "FB",
                            sellstockqty: 1
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "You successfully sold 1 shares of Facebook, Inc. (FB) at $195.47/share for $195.47.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });

        it("should login and sell 0 stocks", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "AlexC",
                    password: "LeagueOfLegends"
                })
                .then(function (res) {
                    return agent.post("/trading-success-sell")
                        .send({
                            _method: "post",
                            sellstockticker: "FB",
                            sellstockqty: 0
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "You need to sell at least 1 share of FB.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });


        it("should login and sell a stock that the user does not have", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "AlexC",
                    password: "LeagueOfLegends"
                })
                .then(function (res) {
                    return agent.post("/trading-success-sell")
                        .send({
                            _method: "post",
                            sellstockticker: "SNAP",
                            sellstockqty: 1
                        })
                        .then(function (res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            var display = $("title").text();
                            assert.equal(title, "You do not own any shares with the ticker \'SNAP\'.");
                            assert.equal(display, "Trading");
                            done();
                        });
                });
        });


        it("should login and attempt to sell a stock with an empty sellstockticker field", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "AlexC",
                    password: "LeagueOfLegends"
                })
                .then(function (res) {
                    agent.post("/trading-success-stocks")
                        .then(function (res) {
                            return agent.post("/trading-success-sell")
                                .send({
                                    _method: "post",
                                    sellstockticker: "",
                                    sellstockqty: 1
                                })
                                .then(function (res) {
                                    expect(res).to.have.status(200);
                                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                                    var $ = cheerio.load(res.text);
                                    var title = $("div[role=alert]").text();
                                    var display = $("title").text();
                                    assert.equal(title, "You cannot leave the sell input blank. Please input a stock ticker");
                                    assert.equal(display, "Trading");
                                    done();
                                });
                        });
                });
        });
    });


    describe("GET /admin", function () {
        it("should attempt to access admin page", function (done) {
            request(app)
                .get("/admin")
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                    var $ = cheerio.load(res.text);
                    var title = $("div[role=alert]").text();
                    assert.equal(
                        title,
                        "You are not authorized to view this page. Please log in with an administrator account."
                    );
                    done();
                });
        });
    });

    var agent = chai.request.agent(app);
    describe("GET /admin-restricted", function () {
        it("should attempt to access admin success page", function (done) {
            request(app)
                .get("/admin-success")
                .end(function (err, res) {
                    expect(res).to.have.status(302);
                    expect(res).to.have.header('content-type', 'text/plain; charset=utf-8');
                    expect(res).to.redirectTo('/admin-restricted');
                    done();
                });
        });

        it("should login and attempt to access admin-restricted page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "AlexC",
                    password: "LeagueOfLegends"
                })
                .then(function (res) {
                    agent.get("/admin-restricted")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div[role=alert]").text();
                            assert.equal(
                                title,
                                "You are not authorized to view this page. Go back to the Trading page."
                            );
                            done();
                        });
                });
        });
    });

    var agent = chai.request.agent(app);
    describe("POST /admin-success", function () {
        it("should login as admin and access the admin page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    agent.get("/admin-success")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div > h1").text();
                            assert.equal(
                                title,
                                "Welcome to the Admin Page"
                            );
                            done();
                        });
                });
        });
    });

    var agent = chai.request.agent(app);
    describe("POST /admin-success-user-accounts", function () {
        it("should login as admin and generate list of all the users", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    agent.post("/admin-success-user-accounts")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("div > h1").text();
                            assert.equal(
                                title,
                                "Welcome to the Admin Page"
                            );
                            done();
                        });
                });
        });
    });

    var agent = chai.request.agent(app);
    describe("POST /admin-success-user-accounts", function () {
        it("should login as admin and attempt to dleete a user with a invalid user_id", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    agent.post("/admin-success-delete-user-success")
                        .send({
                            _method: "post",
                            user_id: "invalid username"
                        })
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                            var response = res.body;
                            var msg = response.msg;
                            assert.equal(msg, "No user exists with that username");
                            done();
                        });
                });
        });

        it("should login with an admin account and attempt to delete themselves", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    agent.post("/admin-success-delete-user-success")
                        .send({
                            _method: "post",
                            user_id: "JoeySalads"
                        })
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                            var response = res.body;
                            var msg = response.msg;
                            assert.equal(msg, "Cannot delete your own account!");
                            done();
                        });
                });
        });

        it("should login as admin and delete a user", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    agent.post("/admin-success-delete-user-success")
                        .send({
                            _method: "post",
                            user_id: "JimmyT"
                        })
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                            var response = res.body;
                            var msg = response.msg;
                            assert.equal(msg, "User is Deleted");
                            done();
                        });
                });
        });

        it("should login and attempt to delete an already deleted user", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    agent.post("/admin-success-delete-user-success")
                        .send({
                            _method: "post",
                            user_id: "JimmyT"
                        })
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                            var response = res.body;
                            var msg = response.msg;
                            assert.equal(msg, "No user exists with that username");
                            done();
                        });
                });
        });
    });


    var agent = chai.request.agent(app);
    describe("GET /trading-portfolio", function () {
        it("should login and access the portfolio page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "JoeySalads",
                    password: "Castle12345"
                })
                .then(function (res) {
                    agent.get("/trading-portfolio")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                            var $ = cheerio.load(res.text);
                            var title = $("title").text();
                            assert.equal(
                                title,
                                "Portfolio"
                            );
                            done();
                        });
                });
        });

        it("should login and change currency on the portfolio page", function (done) {
            agent
                .post("/login")
                .send({
                    _method: "post",
                    username: "AlexC",
                    password: "LeagueOfLegends"
                })
                .then(function (res) {
                    agent.post("/trading-portfolio")
                    .send({
                        _method: "post",
                        currency_preference: "JPY"
                    })
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        expect(res).to.have.header('content-type', 'text/html; charset=utf-8');
                        var $ = cheerio.load(res.text);
                        var title = $("title").text();
                        assert.equal(
                            title,
                            "Portfolio"
                        );
                        done();
                    })
                });
        });
    });
    
})


var reg_mock_data = {
    NFLX: {
        chart: [
            {
                date: "2019-05-01",
                open: 374,
                high: 385.99,
                low: 373.1746,
                close: 378.81,
                volume: 9257284,
                unadjustedVolume: 9257284,
                change: 8.27,
                changePercent: 2.232,
                vwap: 381.3765,
                label: "May 1",
                changeOverTime: 0.06240183980255777
            },
            {
                date: "2019-05-02",
                open: 378,
                high: 383.5,
                low: 374.51,
                close: 379.06,
                volume: 5398167,
                unadjustedVolume: 5398167,
                change: 0.25,
                changePercent: 0.066,
                vwap: 378.6371,
                label: "May 2",
                changeOverTime: 0.06310298407000224
            }
        ]
    },
    AAPL: {
        chart: [
            {
                date: "2019-05-01",
                open: 209.88,
                high: 215.31,
                low: 209.23,
                close: 210.52,
                volume: 64827328,
                unadjustedVolume: 64827328,
                change: 9.85,
                changePercent: 4.909,
                vwap: 212.7216,
                label: "May 1",
                changeOverTime: 0.10829165569886824
            },
            {
                date: "2019-05-02",
                open: 209.84,
                high: 212.65,
                low: 208.13,
                close: 209.15,
                volume: 31996324,
                unadjustedVolume: 31996324,
                change: -1.37,
                changePercent: -0.651,
                vwap: 210.2061,
                label: "May 2",
                changeOverTime: 0.10107923137667817
            }
        ]
    },
    TSLA: {
        chart: [
            {
                date: "2019-05-01",
                open: 238.85,
                high: 240,
                low: 231.5,
                close: 234.01,
                volume: 10704354,
                unadjustedVolume: 10704354,
                change: -4.68,
                changePercent: -1.961,
                vwap: 234.5726,
                label: "May 1",
                changeOverTime: -0.16383191595797905
            },
            {
                date: "2019-05-02",
                open: 245.52,
                high: 247.13,
                low: 237.72,
                close: 244.1,
                volume: 18159339,
                unadjustedVolume: 18159339,
                change: 10.09,
                changePercent: 4.312,
                vwap: 242.4752,
                label: "May 2",
                changeOverTime: -0.12777817480168663
            }
        ]
    },
    GOOG: {
        chart: [
            {
                date: "2019-05-01",
                open: 1188.05,
                high: 1188.05,
                low: 1167.18,
                close: 1168.08,
                volume: 2642983,
                unadjustedVolume: 2642983,
                change: -20.4,
                changePercent: -1.716,
                vwap: 1175.04,
                label: "May 1",
                changeOverTime: -0.00445747500660526
            },
            {
                date: "2019-05-02",
                open: 1167.76,
                high: 1174.19,
                low: 1155,
                close: 1162.61,
                volume: 1944817,
                unadjustedVolume: 1944817,
                change: -5.47,
                changePercent: -0.468,
                vwap: 1162.6,
                label: "May 2",
                changeOverTime: -0.009119499535502165
            }
        ]
    },
    SBUX: {
        chart: [
            {
                date: "2019-05-01",
                open: 77.67,
                high: 78.15,
                low: 77.37,
                close: 77.52,
                volume: 6678194,
                unadjustedVolume: 6678194,
                change: -0.16,
                changePercent: -0.206,
                vwap: 77.6881,
                label: "May 1",
                changeOverTime: 0.04277643260694098
            },
            {
                date: "2019-05-02",
                open: 77.66,
                high: 77.76,
                low: 76.75,
                close: 77.47,
                volume: 6247550,
                unadjustedVolume: 6247550,
                change: -0.05,
                changePercent: -0.064,
                vwap: 77.2603,
                label: "May 2",
                changeOverTime: 0.04210384718859289
            }
        ]
    },
    FB: {
        chart: [
            {
                date: "2019-05-01",
                open: 194.78,
                high: 196.1769,
                low: 193.01,
                close: 193.03,
                volume: 15996646,
                unadjustedVolume: 15996646,
                change: -0.37,
                changePercent: -0.191,
                vwap: 194.5946,
                label: "May 1",
                changeOverTime: 0.15801787749715043
            },
            {
                date: "2019-05-02",
                open: 193,
                high: 194,
                low: 189.75,
                close: 192.53,
                volume: 13209452,
                unadjustedVolume: 13209452,
                change: -0.5,
                changePercent: -0.259,
                vwap: 191.9705,
                label: "May 2",
                changeOverTime: 0.15501829743835865
            }
        ]
    },
    BA: {
        chart: [
            {
                date: "2019-05-01",
                open: 378.53,
                high: 381.1951,
                low: 376.38,
                close: 376.8,
                volume: 2765572,
                unadjustedVolume: 2765572,
                change: -0.89,
                changePercent: -0.236,
                vwap: 379.0197,
                label: "May 1",
                changeOverTime: -0.012112631744533597
            },
            {
                date: "2019-05-02",
                open: 375.5,
                high: 377.65,
                low: 373.25,
                close: 375.8,
                volume: 2438759,
                unadjustedVolume: 2438759,
                change: -1,
                changePercent: -0.265,
                vwap: 375.1206,
                label: "May 2",
                changeOverTime: -0.014734413507419653
            }
        ]
    },
    BABA: {
        chart: [
            {
                date: "2019-05-01",
                open: 186.75,
                high: 193.195,
                low: 185.88,
                close: 189.31,
                volume: 17405482,
                unadjustedVolume: 17405482,
                change: 3.74,
                changePercent: 2.015,
                vwap: 190.1792,
                label: "May 1",
                changeOverTime: 0.037599342285557766
            },
            {
                date: "2019-05-02",
                open: 189.42,
                high: 192.7,
                low: 186.65,
                close: 190.39,
                volume: 11468106,
                unadjustedVolume: 11468106,
                change: 1.08,
                changePercent: 0.57,
                vwap: 189.9392,
                label: "May 2",
                changeOverTime: 0.043518772266374336
            }
        ]
    },
    NKE: {
        chart: [
            {
                date: "2019-05-01",
                open: 87.73,
                high: 87.95,
                low: 85.87,
                close: 85.9,
                volume: 6524576,
                unadjustedVolume: 6524576,
                change: -1.93,
                changePercent: -2.197,
                vwap: 86.7088,
                label: "May 1",
                changeOverTime: 0.020068875430471585
            },
            {
                date: "2019-05-02",
                open: 86.21,
                high: 86.28,
                low: 84.985,
                close: 85.27,
                volume: 6813740,
                unadjustedVolume: 6813740,
                change: -0.63,
                changePercent: -0.733,
                vwap: 85.3986,
                label: "May 2",
                changeOverTime: 0.01258757867236673
            }
        ]
    },
    AMZN: {
        chart: [
            {
                date: "2019-05-01",
                open: 1933.09,
                high: 1943.64,
                low: 1910.55,
                close: 1911.52,
                volume: 3116964,
                unadjustedVolume: 3116964,
                change: -15,
                changePercent: -0.779,
                vwap: 1931.58,
                label: "May 1",
                changeOverTime: 0.07343535027376105
            },
            {
                date: "2019-05-02",
                open: 1913.33,
                high: 1921.55,
                low: 1881.87,
                close: 1900.82,
                volume: 3962915,
                unadjustedVolume: 3962915,
                change: -10.7,
                changePercent: -0.56,
                vwap: 1899.98,
                label: "May 2",
                changeOverTime: 0.0674266460760915
            }
        ]
    }
};

var yest_exchange_rate_mock_data = {
    base: "USD",
    rates: {
        BGN: 1.74344803,
        NZD: 1.4980388661,
        ILS: 3.6056338028,
        RUB: 64.3696737386,
        CAD: 1.3438224282,
        USD: 1.0,
        PHP: 51.8140488501,
        CHF: 1.0195221965,
        AUD: 1.4183455161,
        JPY: 111.3656623284,
        TRY: 5.9647887324,
        HKD: 7.845159565,
        MYR: 4.1285434124,
        HRK: 6.6081297914,
        CZK: 22.8730611517,
        IDR: 14221.5011588518,
        DKK: 6.6541272954,
        NOK: 8.6181137458,
        HUF: 287.9033695846,
        GBP: 0.7688357996,
        MXN: 18.9720984133,
        THB: 31.9147798181,
        ISK: 121.4120164022,
        ZAR: 14.2827598502,
        BRL: 3.9267249064,
        SGD: 1.3605812088,
        PLN: 3.8213585309,
        INR: 69.5859333214,
        KRW: 1165.9921554644,
        RON: 4.2428240328,
        CNY: 6.7339097878,
        SEK: 9.4802995186,
        EUR: 0.8914244963
    },
    date: "2019-04-30"
};

var exchange_rate_mock_data = {
    base: "USD",
    rates: {
        BGN: 1.7443810203,
        NZD: 1.508740635,
        ILS: 3.5975740278,
        RUB: 65.334909026,
        CAD: 1.3435604709,
        USD: 1.0,
        PHP: 51.7508027114,
        CHF: 1.0184623618,
        AUD: 1.4243667499,
        JPY: 111.4966107742,
        TRY: 5.9643239386,
        HKD: 7.8449875134,
        MYR: 4.1369960756,
        HRK: 6.6128255441,
        CZK: 22.8754905458,
        IDR: 14250.0,
        DKK: 6.6584909026,
        NOK: 8.6915804495,
        HUF: 288.9760970389,
        GBP: 0.7664109882,
        MXN: 18.9499643239,
        THB: 32.0246164823,
        ISK: 122.5472707813,
        ZAR: 14.4646806993,
        BRL: 3.9328398145,
        SGD: 1.3609525508,
        PLN: 3.8173385658,
        INR: 69.3738851231,
        KRW: 1163.1733856582,
        RON: 4.2439350696,
        CNY: 6.7345701035,
        SEK: 9.5299678915,
        EUR: 0.8919015341
    },
    date: "2019-05-02"
};

var fb_mock_data = {
    "symbol": "FB",
    "companyName": "Facebook, Inc.",
    "calculationPrice": "close",
    "open": null,
    "openTime": null,
    "close": 195.47,
    "closeTime": 1556913600183,
    "high": 196.16,
    "low": 193.71,
    "latestPrice": 195.47,
    "latestSource": "Close",
    "latestTime": "May 3, 2019",
    "latestUpdate": 1556913600183,
    "latestVolume": 14553073,
    "iexRealtimePrice": null,
    "iexRealtimeSize": null,
    "iexLastUpdated": null,
    "delayedPrice": 195.47,
    "delayedPriceTime": 1556913600183,
    "extendedPrice": 195.69,
    "extendedChange": 0.22,
    "extendedChangePercent": 0.00113,
    "extendedPriceTime": 1557100780038,
    "previousClose": 192.53,
    "change": 2.94,
    "changePercent": 0.01527,
    "iexMarketPercent": null,
    "iexVolume": null,
    "avgTotalVolume": 16839635,
    "iexBidPrice": null,
    "iexBidSize": null,
    "iexAskPrice": null,
    "iexAskSize": null,
    "marketCap": 557976933800,
    "peRatio": 28.8,
    "week52High": 218.62,
    "week52Low": 123.02,
    "ytdChange": 0.455939
}

var closing_fb_price = {
    "FB": {
        "chart": [
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
                "changeOverTime": 0
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
                "changeOverTime": -0.0017433359577100568
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
                "changeOverTime": 0.007198290406028575
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
                "changeOverTime": 0.01029130581486904
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
                "changeOverTime": 0.005904847598695374
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
                "changeOverTime": 0.005398717804521471
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
                "changeOverTime": 0.0025868856146665617
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
                "changeOverTime": 0.02035766505454957
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
                "changeOverTime": 0.033517039703070566
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
                "changeOverTime": 0.026768642447418847
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
                "changeOverTime": 0.08682937802271959
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
                "changeOverTime": 0.07687549207063332
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
                "changeOverTime": 0.09537734787987857
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
                "changeOverTime": 0.08761669103587905
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
                "changeOverTime": 0.0855359352153864
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
                "changeOverTime": 0.08272410302553149
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
                "changeOverTime": 0.09925767630187834
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
                "changeOverTime": 0.09031604993813971
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
                "changeOverTime": 0.06720278933753243
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
                "changeOverTime": 0.06590934653019907
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
                "changeOverTime": 0.06090428523225741
            }
        ]
    }
}

var closing_snap_price = {
    "symbol": "SNAP",
    "companyName": "Snap, Inc.",
    "calculationPrice": "close",
    "open": 10.71,
    "openTime": 1557408600653,
    "close": 10.98,
    "closeTime": 1557432115253,
    "high": 11.1,
    "low": 10.65,
    "latestPrice": 10.98,
    "latestSource": "Close",
    "latestTime": "May 9, 2019",
    "latestUpdate": 1557432115253,
    "latestVolume": 14301118,
    "iexRealtimePrice": 10.985,
    "iexRealtimeSize": 828,
    "iexLastUpdated": 1557431997023,
    "delayedPrice": 10.98,
    "delayedPriceTime": 1557432115263,
    "extendedPrice": 10.99,
    "extendedChange": 0.01,
    "extendedChangePercent": 0.00091,
    "extendedPriceTime": 1557444769243,
    "previousClose": 10.82,
    "change": 0.16,
    "changePercent": 0.01479,
    "iexMarketPercent": 0.010888029872909237,
    "iexVolume": 155711,
    "avgTotalVolume": 26809464,
    "iexBidPrice": 0,
    "iexBidSize": 0,
    "iexAskPrice": 0,
    "iexAskSize": 0,
    "marketCap": 14743801260,
    "peRatio": -12.24,
    "week52High": 14.47,
    "week52Low": 4.82,
    "ytdChange": 0.883529
  }