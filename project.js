const express = require("express");
const hbs = require("hbs");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
var fs = require("fs");
var session = require("express-session");
var utils = require("./utils");
var cookieParser = require("cookie-parser");
var bcrypt = require("bcrypt");



// Importing routes
const { registerRouter, loginRouter, accountsRouter, adminRouter, tradingRouter, aboutRouter, errorRouter } = require('./routers');

// configure which port to use and set it as a environment variable in the process
const port = process.env.PORT || 8080;

// set a directory to to find partials in
hbs.registerPartials(__dirname + "/views/partials/");

// unknown
mongoose.Promise = global.Promise;

// used for logging in? (unsure)
mongoose.connect("mongodb://localhost:27017/accounts", {
	useNewUrlParser: true
});

// make the application instance
var app = express();


// set the view engine to hbs (us	ed to read our hbs files)
app.set("view engine", "hbs");

// set a directory to look for our hbs files, images, css, and native js files
app.use(express.static(__dirname + "/views"));
// set application to use json
app.use(bodyParser.json());
// set application to be able to access nested objects
app.use(bodyParser.urlencoded({ extended: true }));
// initializes passport
app.use(passport.initialize());
// alters request object and change the 'user' value from session id (client cookie) to the true desserialized user object
app.use(passport.session());
// set application to parse cookies (unsure)
app.use(cookieParser());

hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
	return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper("json", function (context) {
	return JSON.stringify(context);
});

hbs.registerHelper("roundToTwo", function (num) {
	return num.toFixed(2);
});

// cookie configuration
app.use(
	session({
		secret: "secretcode",
		resave: false,
		saveUninitialized: false,
		maxAge: 24 * 60 * 60 * 1000
	})
);

// sets the session id as the cookie in user's browser
passport.serializeUser(function (user, done) {
	done(null, user);
});

// gets the session id as the cookie from the user's browser
passport.deserializeUser(function (user, done) {
	done(null, user);
});

// logs whenever a user has successfully logged in
app.use((request, response, next) => {
	var time = new Date().toString();
	var log_entry = `${time}: ${request.method} ${request.url}`;
	fs.appendFile("server.log", log_entry + "\n", error => {
		if (error) {
			console.log("Unable to log message");
		}
	});
	next();
});

// model used to check with mongoDB
var account_schema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 60
	},
	password: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 60
	}
});


passport.use(
	new LocalStrategy(function (username, password, done) {
		user_account.findOne({ username: username }, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false);
			}
			bcrypt.compare(password, user.password, function (err, result) {
				if (err) {
					return done(null, false);
				}
				if (result) {
					return done(null, user);
				} else {
					return done(null, false);
				}
			});
		});
	})
);


const user_account = mongoose.model("user_accounts", account_schema);

app.use(registerRouter);
app.use(loginRouter);
app.use(accountsRouter);
app.use(tradingRouter);
app.use(adminRouter);
app.use(aboutRouter);
app.use(errorRouter);




app.listen(port, () => {
	// application listens on port specified at top of file
	console.log(`Server is up on port ${port}`);
	utils.init();
});

// export application to be used for testing purposes
module.exports = app;
