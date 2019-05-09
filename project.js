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
var moment = require('moment');

// function for getting stock data for the graph
var stockFunc = require('./feature_functions/chartStockData');
// function for getting currency data for the graph
var currFunc = require('./feature_functions/chartCurrData');
// function for getting stock data for the marquee element
var marqueeStock = require('./feature_functions/MarqueeStock');
// function for getting the currency data for the marquee element
var marqueeCurrency = require('./feature_functions/MarqueeCurrency');

// configure which port to use and set it as a environment variable in the process 
const port = process.env.PORT || 8080;

// set a directory to to find partials in
hbs.registerPartials(__dirname + '/views/partials/');

// unknown
mongoose.Promise = global.Promise;

// used for logging in? (unsure)
mongoose.connect("mongodb://localhost:27017/accounts", { useNewUrlParser: true });

// make the application instance
var app = express();
// create a global variable
var ssn;

// set the view engine to hbs (used to read our hbs files)
app.set('view engine', 'hbs');

// set a directory to look for our hbs files, images, css, and native js files
app.use(express.static(__dirname + '/views'));
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

// register database (unsure)
hbs.registerHelper('dbConnection', function(req,res) {
	var url = "mongodb://localhost:27017/accounts";
	return url;
})

// cookie configuration	
app.use(session({
	secret: 'secretcode',
	resave: false,
	saveUninitialized: false
}));

// sets the session id as the cookie in user's browser
passport.serializeUser(function(user, done) {
        done(null, user); 
    });

// gets the session id as the cookie from the user's browser
passport.deserializeUser(function(user, done) {
        done(null, user); 
    });

// logs whenever a user has successfully logged in
app.use((request, response, next) => {
	var time = new Date().toString();
	var log_entry = `${time}: ${request.method} ${request.url}`;
	// console.log(log_entry);
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





app.get('/registration-logged-in', isAuthenticated, (request, response) => {
	// called when user is already logged in and goes to user registration page
	response.render('registration-logged-in.hbs', {
		title: 'You are already logged in. Logout to make a new account.'
	})
});


app.get('/register', (request, response) => {
	// called when user goes to user registration page
	response.render('registration.hbs', {
		title: 'To create an account please enter credentials.'
	})
});

app.post('/register', function(request, response) {
	// called when user submits form data for user registration
	var firstname = request.body.firstname;
	var lastname = request.body.lastname;
	var username = request.body.username;
	var password = request.body.password;
	var message;
	var confirm_password = request.body.confirm_password;
	var db = utils.getDb();
	var attributes = [firstname, lastname, username, password, confirm_password];
	var check;

	if (check_str(attributes[0]) === false) {
		message = `First name must be 3-30 characters long and must only contain letters.`;
		response.render('registration.hbs', {title: message});
	}
	else if (check_str(attributes[1]) === false) {
		message = `Last name must be 3-30 characters long and must only contain letters.`;
		response.render('registration.hbs', {title: message});
	}
	else if (check_uniq(attributes[2]) === false) {
		message = `Username must have 5-15 characters and may only be alphanumeric.`;
		response.render('registration.hbs', {title: message});
	}
	else if (check_uniq(attributes[3]) === false) {
		message = `Password must have 5-15 characters and may only be alphanumeric.`;
		response.render('registration.hbs', {title: message});
	}
	else if ((attributes[3]) !== attributes[4]) {
		message = `Passwords do not match. Please try again.`;
		response.render('registration.hbs', {title: message});
	}
	else {
		check = true;
	}

	if (check) {
		db.collection('user_accounts').findOne({username: username}, function(err, result) {

			if (result === null) {
				db.collection('user_accounts').insertOne({
					firstname: firstname,
					lastname: lastname,
					username: username,
					password: password,
					type: 'standard',
					cash2: [10000],
					stocks: []

				}, (err, result) => {
					if (err) {
						messsage = `There was an error in creating your account. Please try again.`;
						response.render('registration.hbs', {title: `There was an error in creating your account. Please try again.`});
					}
					message = `You have successfully created an account with the username '${username}' and have been granted $10,000 USD. Head over to the login page.`;
					response.render('registration.hbs', {title: message});
				});
			}
			else {
				message = `The username '${username}' already exists within the system.`;
				response.render('registration.hbs', {title: `The username '${username}' already exists within the system.`});
			}
		}

	)};
});

function check_str (string_input) {
	// checks if string value is between 3 and 12 characters, uses RegEx to confirm only alphabetical characters
	var valid_chars = /^[a-zA-Z ]{3,30}$/;
	var string_length = string_input.length;

	if (valid_chars.test(string_input)) {
		flag = true;
	}
	else {
		flag = false;
	}
	return flag;
}

function check_uniq (string_input) {
	// checks if string value is between 5 and 15 characters, uses RegEx to confirm only alphanumerical chars
	var valid_chars = /^([a-zA-Z0-9_-]){5,15}$/;

	if (valid_chars.test(string_input)) {
		flag = true;
	}
	else {
		flag = false;
	}
	return flag;
}










const user_account = mongoose.model("user_accounts", account_schema);


app.get('/', (request, response) => {
	// called when user connects to application
	request.session.destroy(function(err) {
		response.render('login.hbs', {
			title: 'Welcome to the login page.',
			display: "Login"
		})
	});
});

app.get('/login', (request, response) => {
	// called when user connects to application
	request.session.destroy(function(err) {
		response.render('login.hbs', {
			title: 'Welcome to the login page.',
			display: "Login"
		})
	});
});

app.get('/login-fail', (request, response) => {
	// called when user enters invalid username and/or password
	request.session.destroy(function(err) {
		response.status(200);
		response.render('login.hbs', {
			title: 'You have entered an invalid username or password. Please try again or create a new account.',
			display: "Login"
		})
	});
});

app.get('/logout', function (request, response){
	// called when user logs out
  request.session.destroy(function (err) {
  	response.redirect('/');
  });
});

// called when user logs in successfully from /
app.post('/', passport.authenticate('local', { successRedirect: '/trading-success', failureRedirect: '/login-fail' }));

// called when user logs in successfully from /login
app.post('/login', passport.authenticate('local', {successRedirect: '/trading-success', failureRedirect: '/login-fail' }));

// called when uesr logs in successfully from /login-fail
app.post('/login-fail', passport.authenticate('local', {successRedirect: '/trading-success', failureRedirect: '/login-fail' }));

passport.use(new LocalStrategy(
	// configures how we are going to authenticate the user
  function(username, password, done) {
    user_account.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));













app.get("/news-hub", isAuthenticated, async(request, response) => {
	// called when user goes to the news hub page
	if (ssn.stockDataList === undefined) {
		var stockDataList = await marqueeStock.getMarqueeStock();
		ssn.stockDataList = stockDataList;
	}

	if (ssn.currencyDataList === undefined) {
		var currencyDataList = await marqueeCurrency.getMarqueeCurrency();			
		ssn.currencyDataList = currencyDataList;
	}


	response.render("news-hub.hbs", {
		title: 'Stock and Currency.',
		currencyDataList: ssn.currencyDataList,
		stockDataList: ssn.stockDataList
	})
});








app.get('/trading', (request, response) => {
	// called when user goes to trading page while not logged in
	response.render('trading.hbs', {
		title: 'You are not logged in. You must be logged in to view this page.',
		display: "Trading"
	})
});

app.get('/trading-success', isAuthenticated, async(request, response) => {
	// called when user logs in successfully => redicted to this page
	try{
		ssn = request.session;


		var defaultPreference = "currency";
		if (ssn.preference === undefined) {
			ssn.preference = defaultPreference
		}

		if (ssn.currencyDataList === undefined) {
			var currencyDataList = await marqueeCurrency.getMarqueeCurrency();			
			ssn.currencyDataList = currencyDataList
		}

		response.render('trading-success.hbs', {
			title: "Welcome to the trading page.",
			marqueeData: ssn.currencyDataList,
			display: "Trading"
	});
	}
	catch(err){
		console.log(err)
	}
});

app.post('/trading-success-currencies', isAuthenticated, async(request, response) => {
	
	response.render('trading-success-currencies-ticker.hbs');
});

app.post('/trading-success-stocks', isAuthenticated, async(request, response) => {
	try{


		ssn.preference = "stock";
		// console.log(ssn.preference)
		if (ssn.stockDataList === undefined) {
			var stockDataList = await marqueeStock.getMarqueeStock();
			ssn.stockDataList = stockDataList
		}

		response.render('trading-success-stocks-ticker.hbs', {
			title: "Welcome to the trading page.",
			marqueeData: ssn.stockDataList,
			display: "Trading"
		});
	}	
	catch(err) {
		console.log(err);
	};
});




app.get('/news/currency/:id', isAuthenticated, async(request, response) => {
	// called when user clicks on currency text in marquee element
	// or in news hub page
	try {
		// console.log(Object.keys(request));
		var currency_code = request.params.id;
		var chart_data = await currFunc.getCurrData(currency_code);
		// console.log(chart_data);
		var labels = Object.keys(chart_data);
		var data = Object.values(chart_data);

		response.render('currency-info.hbs', {
			title: 'Welcome to the trading page.',
			chart_title: `${currency_code} Price`,
			labels: labels,
			data: data,
			display: `${currency_code} Price`
		})
	} 
	catch(e) {
		console.error(e);
	}
})

app.get('/news/stock/:id', isAuthenticated, async(request, response) => {
	// called when user clicks on stock text in marquee element
	// or in news hub page
	try {
		// console.log(Object.keys(request));
		var ticker = request.params.id;
		var chart_data = await stockFunc.getStockData(ticker);
		// console.log(chart_data);
		var labels = Object.keys(chart_data);
		var data = Object.values(chart_data);

		response.render('stock-info.hbs', {
			title: 'Welcome to the trading page.',
			chart_title: `${ticker} Price`,
			labels: labels,
			data: data,
			display: `${ticker} Price`
		});
	} 
	catch(e) {
		console.error(e);
	}
})


app.post('/trading-success-search', isAuthenticated, async(request, response) => {
	// called when user submits a ticker in ticker search box in trading page
	var stock = request.body.stocksearch;
	var cash2 = request.session.passport.user.cash2;

		var message;

		try {
			const stock_info = await axios.get(`https://cloud.iexapis.com/beta/stock/${stock}/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`);
			var stock_name = stock_info.data.companyName;
			var stock_price = stock_info.data.latestPrice;

			message = `The price of the selected ticker '${stock.toUpperCase()}' which belongs to '${stock_name}' is currently: $${stock_price} USD.`;


		}
		catch (err) {
			if (stock === '') {
				message = 'Please enter a stock ticker i.e. TSLA, MSFT';
			}
			else {
				message = `Sorry the stock ticker '${stock}' is invalid.`;
			}
		}

		switch(ssn.preference) {
			case "stock":
				if (ssn.stockDataList === undefined) {
					var stockDataList = await marqueeStock.getMarqueeStock();
					ssn.stockDataList = stockDataList;
				}
				var marqueeData = ssn.stockDataList;
				break;
			case "currency":
				if (ssn.currencyDataList === undefined) {
					var currencyDataList = await marqueeCurrency.getMarqueeCurrency();			
					ssn.currencyDataList = currencyDataList;
				}
				var marqueeData = ssn.currencyDataList;
				break;
			case undefined:
				if (ssn.currencyDataList === undefined) {
					var currencyDataList = await marqueeCurrency.getMarqueeCurrency();			
					ssn.currencyDataList = currencyDataList;
				}
				var marqueeData = ssn.currencyDataList;
				break;
		}
		// console.log(ssn.preference)
		response.render('trading-success.hbs', {
				title: message,
				head: `Cash balance: $${cash2[0]}`,
				marqueeData: marqueeData,
				display: "Trading"
				})

});

app.post('/trading-success-buy', isAuthenticated, async(request, response) => {
	// called when user submits ticker in stock buy form in trading page
	var _id = request.session.passport.user._id;
	var cash = request.session.passport.user.cash;
	var qty = request.body.buystockqty;
	var stock = (request.body.buystockticker).toUpperCase();
	var stocks = request.session.passport.user.stocks;
	var cash2 = request.session.passport.user.cash2;


	var index = check_existence(stock);

	try {		
		const stock_info = await axios.get(`https://cloud.iexapis.com/beta/stock/${stock}/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`);
		var stock_name = stock_info.data.companyName;
		var stock_price = stock_info.data.latestPrice;
		var total_cost = Math.round(stock_price*qty*100)/100;
		var cash_remaining = Math.round((cash2 - total_cost)*100)/100;
		var stock_holding = {[stock]:parseFloat(qty)};

		if ((cash_remaining >= 0) && (total_cost !== 0) && (qty > 0)) {

			var db = utils.getDb();

			if (index >= 0) {
				var stock_qty = request.session.passport.user.stocks[index][stock];
				var stock_remaining = parseFloat(qty) + parseFloat(stock_qty);
				stock_holding = {[stock]:parseFloat(stock_remaining)};
				stocks[index] = stock_holding;
				cash2[0] = cash_remaining;
			}
			else {
				cash2[0] = cash_remaining;
				
				// console.log("cash_remaining after else, after cash=cash_remain:"+cash_remaining);


				stocks.push(stock_holding);
			}
			// console.log('cash_remaining before update:'+cash_remaining);
			// console.log('cash added to database' + cash);

			db.collection('user_accounts').updateOne(
				{ "_id": ObjectID(_id)},
				{ $set: { "cash2": cash2, "stocks": stocks}}
			);

			message = `You successfully purchased ${qty} shares of ${stock_name} (${stock}) at $${stock_price}/share for $${total_cost}.`;

		}
		else if (total_cost === 0) {
			message = `Sorry you need to purchase at least 1 stock. Change your quantity to 1 or more.`;
		}
		else if (qty < 0) {
			message = `You cannot buy negative shares.`;
		}
		else {
			message = `Sorry you only have $${cash2[0]}. The purchase did not  go through. The total cost was $${total_cost}.`;
		}

	}
	catch (err) {
		if (stock === '') {
			message = `Sorry, you must input a stock to buy.`;
		}
		else {
			message = `Sorry the stock ticker '${request.body.buystockticker}' is invalid.`;
		}
	}
		switch(ssn.preference) {
			case "stock":
				if (ssn.stockDataList === undefined) {
					var stockDataList = await marqueeStock.getMarqueeStock();
					ssn.stockDataList = stockDataList;
				}
				var marqueeData = ssn.stockDataList;
				break;
			case "currency":
				if (ssn.currencyDataList === undefined) {
					var currencyDataList = await marqueeCurrency.getMarqueeCurrency();			
					ssn.currencyDataList = currencyDataList;
				}
				var marqueeData = ssn.currencyDataList;
				break;
			case undefined:
				if (ssn.currencyDataList === undefined) {
					var currencyDataList = await marqueeCurrency.getMarqueeCurrency();			
					ssn.currencyDataList = currencyDataList;
				}
				var marqueeData = ssn.currencyDataList;
				break;
		}
		// console.log(ssn.preference)
	response.render('trading-success.hbs', {
					title: message,
					head: `Cash balance: $${cash2[0]}`,
					marqueeData: marqueeData,
					display: "Trading"
				})

	function check_existence(stock) {
		var index = -1;

		for (i = 0; i < stocks.length; i++) {
			if (stocks[i][stock] !== undefined) {
				index = i;
			}
		}

		return index;
	}
});

app.post('/trading-success-sell', isAuthenticated, async(request, response) => {
	// called when user submits ticker in stock sell form in trading page
	// console.log();
	var _id = request.session.passport.user._id;
	var cash = request.session.passport.user.cash;
	var cash2 = request.session.passport.user.cash2;
	var qty = parseFloat(request.body.sellstockqty);
	var stock = (request.body.sellstockticker).toUpperCase();
	var stocks = request.session.passport.user.stocks;

		

	var index = check_existence(stock);
	var message;

	try {		
		const stock_info = await axios.get(`https://cloud.iexapis.com/beta/stock/${stock}/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`);

		var stock_name = stock_info.data.companyName;
		var stock_price = stock_info.data.latestPrice;
		var total_sale = Math.round(stock_price*qty*100)/100;
		var remaining_balance = Math.round((cash2[0] + total_sale)*100)/100;
		var stock_qty = request.session.passport.user.stocks[index][stock];
		var stock_remaining = stock_qty - qty;

		if (stock_qty < qty) {
			message = `You are trying to sell ${qty} shares of ${stock} when you only have ${stock_qty} shares.`;
		}
		else if ((stock_qty >= qty) && (total_sale > 0)) {
			var db = utils.getDb();
			// console.log(stocks);

			if (stock_remaining > 0) {
				var stock_holding = {[stock]:parseFloat(stock_remaining)};
				stocks[index] = stock_holding;
				cash2[0] = remaining_balance;
			}
			else {
				stocks.splice(index, 1);
				cash2[0] = remaining_balance;
			}

			db.collection('user_accounts').updateOne(
					{ "_id": ObjectID(_id)},
					{ $set: { "cash2": cash2, "stocks": stocks}}
				);

			message = `You successfully sold ${qty} shares of ${stock_name} (${stock}) at $${stock_price}/share for $${total_sale}.`
		}
		else {
			message = `You need to sell atleast 1 share of ${stock}.`;
		}

	}
	catch(err) {
		if (stock === '') {
			message = `You cannot leave the sell input blank. Please input a stock ticker`;

		}
		else {
			message = `You do not own any shares with the ticker '${stock}'.`;
		}
	}
	switch(ssn.preference) {
		case "stock":
			if (ssn.stockDataList === undefined) {
				var stockDataList = await marqueeStock.getMarqueeStock();
				ssn.stockDataList = stockDataList;
			}
			var marqueeData = ssn.stockDataList;
			break;
		case "currency":
			if (ssn.currencyDataList === undefined) {
				var currencyDataList = await marqueeCurrency.getMarqueeCurrency();			
				ssn.currencyDataList = currencyDataList;
			}
			var marqueeData = ssn.currencyDataList;
			break;
		case undefined:
			if (ssn.currencyDataList === undefined) {
				var currencyDataList = await marqueeCurrency.getMarqueeCurrency();			
				ssn.currencyDataList = currencyDataList;
			}
			var marqueeData = ssn.currencyDataList;
			break;
	}
	// console.log(ssn.preference)
	response.render('trading-success.hbs', {
		title: message,
		head: `Cash balance: $${cash2[0]}`,
		marqueeData: marqueeData,
		display: "Trading"
	})		

	function check_existence(stock) {
		var index = -1;

		for (i = 0; i < stocks.length; i++) {
			if (stocks[i][stock] !== undefined) {
				index = i;
			}
		}
		return index;
	}
});

app.post('/trading-success-holdings', isAuthenticated, async(request, response) => {
	// called when user checks their stocks in portfolio page
	var stocks = request.session.passport.user.stocks;
	var num_stocks = stocks.length;
	var stock_keys = [];
	var cash = request.session.passport.user.cash;
	var message = 'Shares: \n';
	var cash2 = request.session.passport.user.cash2;

	if (num_stocks === 0) {
		message = 'You currently do not have any stocks.';
	}
	else {
		var i;
		for (i = 0; i < num_stocks; i++) {
			stock_keys.push(Object.keys(stocks[i]));
			var key_value = stocks[i][stock_keys[i][0]];
			message += stock_keys[i][0] + ': ' + key_value + ' shares.' + '\n';
			// console.log(message);
		}
	}
	switch(ssn.preference) {
		case "stock":
			if (ssn.stockDataList === undefined) {
				var stockDataList = await marqueeStock.getMarqueeStock();
				ssn.stockDataList = stockDataList;
			}
			var marqueeData = ssn.stockDataList;
			break;
		case "currency":
			if (ssn.currencyDataList === undefined) {
				var currencyDataList = await marqueeCurrency.getMarqueeCurrency();			
				ssn.currencyDataList = currencyDataList;
			}
			var marqueeData = ssn.currencyDataList;
			break;
		case undefined:
			if (ssn.currencyDataList === undefined) {
				var currencyDataList = await marqueeCurrency.getMarqueeCurrency();			
				ssn.currencyDataList = currencyDataList;
			}
			var marqueeData = ssn.currencyDataList;
			break;
	}
	// console.log(ssn.preference)
	response.render('trading-success.hbs', {
		title: message,
		head: `Cash: $${cash2[0]}`,
		marqueeData: marqueeData,
		display: "Trading"
	})
});



app.get('/trading-portfolio', isAuthenticated, (request, response) => {
	// called when user accesses portfolio page
	response.render('trading-portfolio.hbs', {
		title: 'Welcome to the Portfolio Page.',
		display: "Portfolio"
	})
});

app.post('/trading-portfolio-holdings', isAuthenticated, (request, response) => {
	// called when user loads their data in portfolio data
	var stocks = request.session.passport.user.stocks;
	var num_stocks = stocks.length;
	var stock_keys = [];
	var cash = request.session.passport.user.cash;
	var message = 'Shares: \n';
	var cash2 = request.session.passport.user.cash2;

	if (num_stocks === 0) {
		message = 'You currently do not have any stocks.';
	}
	else {
		var i;
		for (i = 0; i < num_stocks; i++) {
			stock_keys.push(Object.keys(stocks[i]));
			var key_value = stocks[i][stock_keys[i][0]];
			message += stock_keys[i][0] + ': ' + key_value + ' shares.' + '\n';
			// console.log(message);
		}
	}

	response.render('trading-portfolio.hbs', {
		title: message,
		head: `Balance: $${cash2[0]}`,
		display: "Portfolio"
	})
});


app.get('/admin', (request, response) => {
	// called when user who is not logged in tries to access the admin page
	response.render('admin-restricted-not-logged-in.hbs', {
		title: 'You are not authorized to view this page. Please log in with an administrator account.'
	})
});

app.get('/admin-restricted', isAuthenticated, (request, response) => {
	// called when user is logged in and tries to access the admin page
	response.render('admin-restricted.hbs', {
		title: 'You are not authorized to view this page. Go back to the Trading page.'
	})
});

app.get('/admin-success', isAdmin, (request, response) => {
	// called when user is admin and is logged in
	response.render('admin-success', {
		title: 'Welcome to the Admin Page'
	});
});

app.post('/admin-success-user-accounts', isAdmin, function(req, res, next) {
	// called when admin user loads all user accounts from database
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
	// called when admin user submits a username to delete from admin page
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
	// I think this does the same thing as POST /admin-success-delete-user
	var user_name_to_delete = req.body.user_id;
	var username = req.session.passport.user.username;

	// console.log(user_name_to_delete)
	// console.log(username)
	if(user_name_to_delete == username){
		res.render('admin-success-user-accounts-list.hbs', {
			message: "Cannot delete your own account!"
		});
		return;
	}else{
		if(user_name_to_delete == '') {
			res.render('admin-success-user-accounts-list.hbs', {
				message: "Cannot be empty",
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
							res.render('admin-success-user-accounts-list.hbs', {
								message: message
							});
						};
						//console.log(result);
						if(result === undefined || result.length == 0) {
							message = 'No user exists with that username';
							console.log(message)
							res.render('admin-success-user-accounts-list.hbs', {
								message: message
							});
						}else {
							db.collection('user_accounts').deleteOne(query, function(err, obj) {
								if(err) throw err;
								console.log("User Deleted");
								message ='User is Deleted';
								res.render('admin-success-user-accounts-list.hbs', {
								message: message,
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
	// called when admin user accesses update user balance page
	res.render('admin-success-update-balances.hbs', {
		message: 'Enter the user ID and cash you would like to change to.'
	});
});

app.post('/admin-success-update-balances', isAdmin, function(req, res, next) {
	// called when admin user submits information to update a user account's balance
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
	// unknown
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
	// unknown
	var user_id_to_update = req.body.user_id
	var user_balance = parseFloat(req.body.user_balance)
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
	// called when request page cannot be found
	response.status(400)
	response.render('404.hbs', {
		title: `Sorry the URL 'localhost:8080${request.url}' does not exist.`
	})
});

function errorPage(request, response, next) {
	if (request.session.passport !== undefined) {
		// console.log(request.session.passport);
		next();
	} else {
		// response.redirect('/login');
		response.status(400);
		response.render('404x.hbs', {
			title: `Sorry the URL 'localhost:8080${request.url}' does not exist.`
		})
	}
}

function isAuthenticated(request, response, next) {
	if (request.session.passport !== undefined) {
		// console.log(request.session.passport);
		next();
	} else {
		response.redirect('/');
	}
}

function isAdmin(request, response, next) {
	if ((request.session.passport !== undefined) && (request.session.passport.user.type === 'admin')) {
		// console.log(request.session.passport);
		next();
	} else {
		response.redirect('/admin-restricted');
	}
}

app.listen(port, () => {
	// application listens on port specified at top of file
	console.log(`Server is up on port ${port}`);
	utils.init();
});

// export application to be used for testing purposes
module.exports = app;
