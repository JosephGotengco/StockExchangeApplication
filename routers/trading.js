const express = require('express');
var axios = require('axios');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var hbs = require('hbs');
const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var utils = require('../utils');

const router = new express.Router();

var ssn;

hbs.registerHelper('dbConnection', function(req,res) {
	var url = "mongodb://localhost:27017/accounts";
	return url;
})








router
.route('/trading')
.get((request, response) => {
	response.render('trading.hbs', {
		title: 'You are not logged in. You must be logged in to view this page.'
	})
})

router
.route('/trading-success')
.get(isAuthenticated, (request, response) => {
	response.render('trading-success.hbs', {
		title: 'Welcome to the trading page.'
	})
})

router
.route('/trading-success-search')
.post(isAuthenticated, async(request, response) => {
	// Gets information about stock (What stock it searches is from the input box on trading-success.hbs)

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
		response.render('trading-success.hbs', {
				title: message,
				head: `Cash balance: $${cash2[0]}`
				})

})

router
.route('/trading-success-buy')
.post(isAuthenticated, async(request, response) => {

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
		var stock_holding = {[stock]:parseInt(qty)};

		if ((cash_remaining >= 0) && (total_cost !== 0) && (qty > 0)) {

			var db = utils.getDb();

			if (index >= 0) {
				var stock_qty = request.session.passport.user.stocks[index][stock];
				var stock_remaining = parseInt(qty) + parseInt(stock_qty);
				stock_holding = {[stock]:parseInt(stock_remaining)};
				stocks[index] = stock_holding;
				cash2[0] = cash_remaining;
			}
			else {
				cash2[0] = cash_remaining;
				
				console.log("cash_remaining after else, after cash=cash_remain:"+cash_remaining);


				stocks.push(stock_holding);
			}
			console.log('cash_remaining before update:'+cash_remaining);
			console.log('cash added to database' + cash);

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

	response.render('trading-success.hbs', {
					title: message,
					head: `Cash balance: $${cash2[0]}`
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
})

router
.route('/trading-success-sell')
.post(isAuthenticated, async(request, response) => {
	// console.log(request.session.passport.user._id);
	// console.log();
	var _id = request.session.passport.user._id;
	var cash = request.session.passport.user.cash;
	var cash2 = request.session.passport.user.cash2;
	var qty = parseInt(request.body.sellstockqty);
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
			console.log(stocks);

			if (stock_remaining > 0) {
				var stock_holding = {[stock]:parseInt(stock_remaining)};
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
	response.render('trading-success.hbs', {
		title: message,
		head: `Cash balance: $${cash2[0]}`
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
})

router
.route('/trading-success-holdings')
.post(isAuthenticated, (request, response) => {
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
			console.log(message);
		}
	}

	response.render('trading-success.hbs', {
		title: message,
		head: `Cash: $${cash2[0]}`
	})
})


function isAuthenticated(request, response, next) {
	if (request.session.passport !== undefined) {
		console.log(request.session.passport);
		next();
	} else {
		response.redirect('/');
	}
}

module.exports = router