//#------ These lines below import modules ------#//
const express = require('express');
const axios = require('axios');
const hbs = require('hbs');
const path = require("path");
const LocalStrategy = require('passport-local');
const passport = require('passport');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const check = require('express-validator');
var utils = require('./utils');
var cookieParser = require('cookie-parser');
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');


// vvvvvvv CONFIGURATION vvvvvv //

//#------ This line makes a link (like css link) for the folder that contains placeholders for hbs files------#//
hbs.registerPartials(__dirname + '/views/partials');
module.exports = app;

mongoose.Promise = global.Promise;

// password login
mongoose.connect("mongodb://localhost:27017/accounts", { useNewUrlParser: true });
const { registerRouter, tradingRouter } = require('./routers');

var app = express();

//#------ Sets the view engine to hbs which allows the application (this file) to use hbs files instead of html files ------#//
app.set('view engine', 'hbs');

//#------ Lines below help parse data that comes in from users (webpages); don't need to touch these ------#//
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

hbs.registerHelper('dbConnection', function(req,res) {
	var url = "mongodb://localhost:27017/accounts";
	return url;
})

//#------ | Helps differentiate between multiple users who connect to this application (this file) vvv ------#//

app.use(session({
	secret: 'secretcode',
	resave: false,
	saveUninitialized: false
}));


passport.serializeUser(function(user, done) {
        done(null, user); 
    });

passport.deserializeUser(function(user, done) {
        done(null, user); 
    });

app.use((request, response, next) => {
	var time = new Date().toString();
	var log_entry = `${time}: ${request.method} ${request.url}`;
	console.log(log_entry);
	fs.appendFile('server.log', log_entry + '\n', (error) => {
		if (error) {
			console.log('Unable to log message');
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
// ^^^^^^^ CONFIGURATION ^^^^^^^ //





// vvvvvv LOGIN vvvvvv //

const user_account = mongoose.model("user_accounts", account_schema);
// var Users = mongoose.model('user_accounts', account_schema);

// Routes for registration
app.use(registerRouter);
// Routers for trading
app.use(tradingRouter);
// End point for logging in (First Page a user sees)
app.get('/', (request, response) => {
	request.session.destroy(function(err) {
		response.render('login.hbs', {
			title: 'Welcome to the login page.'
		})
	});
});

// ^^^ Cannot we just redirect them to the GET root endpoint? ^^^ 
app.get('/login', (request, response) => {
	request.session.destroy(function(err) {
		response.render('login.hbs', {
			title: 'Welcome to the login page.'
		})
	});
});

// End point if user has invalid credentials
app.get('/login-fail', (request, response) => {
	request.session.destroy(function(err) {
		response.render('login.hbs', {
			title: 'You have entered an invalid username or password. Please try again or create a new account.'
		})
	});
});

// End point for logging user out of session (passport)
app.get('/logout', function (request, response){
  request.session.destroy(function (err) {
  	response.redirect('/');
  });
});

// Post end point for logging in
app.post('/', passport.authenticate('local', { successRedirect: '/trading-success', failureRedirect: '/login-fail' }));

// Authenticates user and redirects them to /trading-success end point
app.post('/login', passport.authenticate('local', {successRedirect: '/trading-success', failureRedirect: '/login-fail' }));

// Literally does same thing as above end point (Subject to fix!!!)
app.post('/login-fail', passport.authenticate('local', {successRedirect: '/trading-success', failureRedirect: '/login-fail' }));

// Specifies how we are going to authenticate the user
// We search the database for any docuemnt that has the specified username and password	
passport.use(new LocalStrategy(
  function(username, password, done) {
    user_account.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

// ^^^^^^ LOGIN ^^^^^^ //





app.get('/admin', (request, response) => {
	response.render('admin-restricted-not-logged-in.hbs', {
		title: 'You are not authorized to view this page. Please log in with an administrator account.'
	})
});

app.get('/admin-restricted', isAuthenticated, (request, response) => {
	response.render('admin-restricted.hbs', {
		title: 'You are not authorized to view this page. Go back to the Trading page.'
	})
});

app.get('/admin-success', isAdmin, (request, response) => {
    response.render('admin-success', {
    	title: 'Welcome to the Admin Page'
    });
 });

app.post('/admin-success-user-accounts', isAdmin, function(req, res, next) {
	mongoose.connect("mongodb://localhost:27017/accounts", function(err, db) {
		assert.equal(null, err);
		db.collection('user_accounts').find().toArray(function(err, result) {
			if (err) {
				res.send('Unable to fetch Accounts');
			}
			res.render('admin-success-user-accounts-list.hbs', {
				result: result
			});
		});
		db.close;
	});
});

app.post('/admin-success-delete-user', isAdmin, function(req, res, next) {
	mongoose.connect("mongodb://localhost:27017/accounts", function(err, db) {
		assert.equal(null, err);
		db.collection('user_accounts').find().toArray(function(err, result) {
			if(err) {
				res.send('Unable to fetch Accounts');
			}
			res.render('admin-success-delete-user-success.hbs', {
				result: result
			});
		});
		db.close;
	})});

app.post('/admin-success-delete-user-success', function(req, res, next) {
	var user_name_to_delete = req.body.user_id;
	var username = req.session.passport.user.username;

	console.log(user_name_to_delete)
	console.log(username)
	if(user_name_to_delete == username){
		res.render('admin-success-delete-user-success.hbs', {
			message: "Cannot delete your own account!"
		});
		return;
	}else{
		if(user_name_to_delete == '') {
			res.render('admin-success-delete-user-success.hbs', {
				message: "Cannot be empty"
			});
		}else{
			// try {
				// console.log(user_id_to_delete);
				message = '';
				mongoose.connect("mongodb://localhost:27017/accounts", function(err, db) {
					assert.equal(null, err);

					var query = { username: user_name_to_delete }

					//console.log(query)
					db.collection('user_accounts').find(query).toArray(function(err, result) {
						if(err) {
							message = 'Unable to Delete Account';
							console.log(message)
							// console.log(err);
							res.render('admin-success-delete-user-success.hbs', {
								message: message
							});
						};
						//console.log(result);
						if(result === undefined || result.length == 0) {
							message = 'No user exists with that username';
							console.log(message)
							res.render('admin-success-delete-user-success.hbs', {
								message: message
							});
						}else {
							db.collection('user_accounts').deleteOne(query, function(err, obj) {
								if(err) throw err;
								console.log("User Deleted");
								message ='User is Deleted';
								res.render('admin-success-delete-user-success.hbs', {
								message: message
							});
								db.close();
							});
						};
					});
				});

			};
		};
});

app.get('/admin-success-update-balances', isAdmin, function(req, res, next) {
	res.render('admin-success-update-balances.hbs', {
		message: 'Enter the user ID and cash you would like to change to.'
	});
});

app.post('/admin-success-update-balances', isAdmin, function(req, res, next) {
	var user_id = req.body.user_id;
	var new_balance = req.body.user_balance;
	var balance_to_list = [new_balance];
	var message;

	console.log(new_balance);

	if (new_balance > 0) {

		try {
			db.collection('user_accounts').findOne({_id: user_id}, function(err, result) {

				if (result !== null) {

					db.collection('user_accounts').updateOne(
						{ "_id": ObjectID(_id)},
						{ $set: {"cash2": balance_to_list}}
					);

					message = `ID: ${user_id} cash has been changed to ${new_balance}.`
				}
			})
		}
		catch(err) {
			message = `User ID doesn't exist.`;
		}
	}
	else {
		message = `Number must be greater than 0.`;
	}

	res.render('admin-success-update-balances.hbs', {
		message: message
	});
})

app.post('/admin-success-update-balances', isAdmin, function(req, res, next) {
	mongoose.connect("mongodb://localhost:27017/accounts", function(err, db) {
		assert.equal(null, err);
		db.collection('user_accounts').find().toArray(function(err, result) {
			if (err) {
				res.send('Unable to fetch Accounts');
			}
			res.render('admin-success-update-balances.hbs', {
				result: result
			});
		});
		db.close;
	});
});

app.post('/admin-success-update-balances-success', isAdmin, function(req, res, next){
	var user_id_to_update = req.body.user_id
	var user_balance = parseInt(req.body.user_balance)
	console.log(user_balance);
	var balance_to_list = []
	balance_to_list[0] = user_balance
	console.log(balance_to_list[0]);
	if(user_id_to_update == '') {
		res.render('admin-success-update-balances-success.hbs', {
			message: "Cannot be empty"
		});
	}else{
	console.log(user_id_to_update);
		message = '';
		mongoose.connect("mongodb://localhost:27017/accounts", function(err, db) {
			assert.equal(null, err);
			var query = { _id: ObjectID(user_id_to_update) }
			//console.log(query)
			db.collection('user_accounts').findOne(query).toArray(function(err, result) {
				if(err) {
					message = 'Unable to Update Account';
					console.log(message)
					// console.log(err);
					res.render('admin-success-update-balances-success.hbs', {
						message: message
					});
				}
				//console.log(result);
				if(result === undefined || result.length == 0) {
					message = 'No user exists with that Id';
					console.log(message)
					res.render('admin-success-update-balances-success.hbs', {
						message: message
					});
				}else {
					db.collection('user_accounts').updateOne(
						{ "_id": user_id_to_update},
						{ $set: { "cash2": balance_to_list }

				})
					res.render('admin-success-update-balances-success.hbs', {
						message: 'Update Successfully'
				});
				}
			})
		})
	}})

app.get('*', errorPage, (request, response) => {
	response.render('404.hbs', {
		title: `Sorry the URL 'localhost:8080${request.url}' does not exist.`
	})
});

function errorPage(request, response, next) {
	if (request.session.passport !== undefined) {
		console.log(request.session.passport);
		next();
	} else {
		// response.redirect('/login');
		response.render('404x.hbs', {
			title: `Sorry the URL 'localhost:8080${request.url}' does not exist.`
		})
	}
}

function isAuthenticated(request, response, next) {
	if (request.session.passport !== undefined) {
		console.log(request.session.passport);
		next();
	} else {
		response.redirect('/');
	}
}

function isAdmin(request, response, next) {
	if ((request.session.passport !== undefined) && (request.session.passport.user.type === 'admin')) {
		console.log(request.session.passport);
		next();
	} else {
		response.redirect('/admin-restricted');
	}
}

// listen to port 8080
app.listen(8080, () => {
	console.log('Server is up on port 8080');
	utils.init();
});