const express = require('express');
var axios = require('axios');
var ObjectID = require('mongodb').ObjectID;
var utils = require('../utils');
var ssn;

const router = new express.Router();

router
	.route("/trading")
	.get((request, response) => {
		// called when user goes to trading page while not logged in
		response.render("trading.hbs", {
			title: "You are not logged in. You must be logged in to view this page.",
			display: "Trading"
		});
	})

router
	.route("/trading-success")
	.get(isAuthenticated, async (request, response) => {
		// called when user logs in successfully => redicted to this page
		try {
			ssn = request.session;
			var cash2 = request.session.passport.user.cash2;
			var defaultPreference = "currency";
			if (ssn.preference === undefined) {
				ssn.preference = defaultPreference;
			}

			if (ssn.currencyDataList === undefined) {
				var currencyDataList = await marqueeCurrency.getMarqueeCurrency();
				ssn.currencyDataList = currencyDataList;
			}

			response.render("trading-success.hbs", {
				title: "Welcome to the trading page.",
				marqueeData: ssn.currencyDataList,
				display: "Trading",
				preference: ssn.preference,
				userCash: cash2[0]
			});
		} catch (err) {
			console.log(err);
		}
	})

router
	.route("/trading-success-stocks")
	.post(isAuthenticated, async (request, response) => {
		try {
			ssn.preference = "stock";
			if (ssn.stockDataList === undefined) {
				var stockDataList = await marqueeStock.getMarqueeStock();
				ssn.stockDataList = stockDataList;
			}

			response.render("trading-success.hbs", {
				title: "Welcome to the trading page.",
				marqueeData: ssn.stockDataList,
				display: "Trading",
				preference: ssn.preference,
			});
		} catch (err) {
			console.log(err);
		}
	})

router
	.route("/trading-success-search")
	.post(isAuthenticated, (request, response) => {
		// called when user submits a ticker in ticker search box in trading page
		var stock = request.body.stocksearch.toUpperCase();
		var cash2 = request.session.passport.user.cash2;
		console.log(cash2)
		var message;

		try {
			const stock_info = await axios.get(
				`https://cloud.iexapis.com/beta/stock/${stock}/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`
			);
			var stock_name = stock_info.data.companyName;
			var stock_price = stock_info.data.latestPrice;

			message = `The price of the selected ticker '${stock}' which belongs to '${stock_name}' is currently: $${stock_price} USD.`;
		} catch (err) {
			if (stock === "") {
				message = "Please enter a stock ticker i.e. TSLA, MSFT";
			} else {
				message = `Sorry the stock ticker '${stock}' is invalid.`;
			}
		}

		switch (ssn.preference) {
			case "stock":
				var marqueeData = ssn.stockDataList;
				break;
			case "currency":
				var marqueeData = ssn.currencyDataList;
				break;
		}
		response.render("trading-success.hbs", {
			title: message,
			head: `Cash balance: $${cash2[0]}`,
			marqueeData: marqueeData,
			display: "Trading",
			preference: ssn.preference
		});
	})


router
	.route("/trading-success-buy")
	.post(isAuthenticated, async (request, response) => {
		// called when user submits ticker in stock buy form in trading page
		var _id = request.session.passport.user._id;
		var cash = request.session.passport.user.cash;
		var qty = parseFloat(request.body.buystockqty);
		var stock = request.body.buystockticker.toUpperCase();
		var stocks = request.session.passport.user.stocks;
		var cash2 = request.session.passport.user.cash2;
		var transactions = request.session.passport.user.transactions;

		var index = check_existence(stock);
		var message;

		try {
			const stock_info = await axios.get(
				`https://cloud.iexapis.com/beta/stock/${stock}/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`
			);
			var stock_name = stock_info.data.companyName;
			var stock_price = stock_info.data.latestPrice;
			var total_cost = Math.round(stock_price * qty * 100) / 100;
			var cash_remaining = Math.round((cash2 - total_cost) * 100) / 100;

			if (cash_remaining >= 0 && total_cost !== 0 && qty > 0) {
				var db = utils.getDb();
				if (index >= 0) {
					var stock_qty = request.session.passport.user.stocks[index].amount;
					var stock_remaining = parseFloat(qty) + parseFloat(stock_qty);
					stock_holding = {
						stock_name: stock,
						amount: parseFloat(stock_remaining)
					};
					stocks[index] = stock_holding;
					cash2[0] = cash_remaining;
				} else {
					stock_holding = {
						stock_name: stock,
						amount: parseFloat(qty)
					};
					cash2[0] = cash_remaining;
					stocks.push(stock_holding);
				}
				var log = {
					datetime: new Date().toString(),
					stock_name: stock_name,
					qty: qty,
					total_cost: total_cost,
					type: "B",
					balance: cash_remaining
				};
				transactions.push(log);
				db.collection("user_accounts").updateOne(
					{ _id: ObjectID(_id) },
					{ $set: { cash2: cash2, stocks: stocks, transactions: transactions } }
				);

				message = `You successfully purchased ${qty} shares of ${stock_name} (${stock}) at $${stock_price}/share for $${total_cost}.`;
			} else if (total_cost === 0) {
				message = `Sorry you need to purchase at least 1 stock. Change your quantity to 1 or more.`;
			} else if (qty < 0) {
				message = `You cannot buy negative shares.`;
			} else {
				message = `Sorry you only have $${
					cash2[0]
					}. The purchase did not go through. The total cost was $${total_cost}.`;
			}
		} catch (err) {
			if (stock === "") {
				message = `Sorry, you must input a stock to buy.`;
			} else {
				message = `Sorry the stock ticker '${
					request.body.buystockticker
					}' is invalid.`;
			}
		}
		switch (ssn.preference) {
			case "stock":
				var marqueeData = ssn.stockDataList;
				break;
			case "currency":
				var marqueeData = ssn.currencyDataList;
				break;
		}
		response.render("trading-success.hbs", {
			title: message,
			head: `Cash balance: $${cash2[0]}`,
			marqueeData: marqueeData,
			display: "Trading",
			preference: ssn.preference
		});

		function check_existence(stock) {
			var index = -1;

			for (i = 0; i < stocks.length; i++) {
				console.log(stocks[i].stock_name === stock)
				if (stocks[i].stock_name === stock) {
					index = i;
				}
			}

			return index;
		}
	})

router
	.route("/trading-success-sell")
	.post(isAuthenticated, (request, response) => {
		// called when user submits ticker in stock sell form in trading page
		var _id = request.session.passport.user._id;
		var cash = request.session.passport.user.cash;
		var cash2 = request.session.passport.user.cash2;
		var qty = parseFloat(request.body.sellstockqty);
		var stock = request.body.sellstockticker.toUpperCase();
		var stocks = request.session.passport.user.stocks;
		var transactions = request.session.passport.user.transactions;
		console.log(typeof cash2);
		console.log(cash2)
		var index = check_existence(stock);
		console.log(`index: ${index}`)
		var message;

		try {
			const stock_info = await axios.get(
				`https://cloud.iexapis.com/beta/stock/${stock}/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`
			);

			var stock_name = stock_info.data.companyName;
			var stock_price = stock_info.data.latestPrice;
			var total_sale = Math.round(stock_price * qty * 100) / 100;
			var cash_remaining = Math.round((cash2[0] + total_sale) * 100) / 100;
			var stock_qty = request.session.passport.user.stocks[index].amount;
			var stock_remaining = stock_qty - qty;

			if (stock_qty < qty) {
				message = `You are trying to sell ${qty} shares of ${stock} when you only have ${stock_qty} shares.`;
			} else if (stock_qty >= qty && total_sale > 0) {
				var db = utils.getDb();

				if (stock_remaining > 0) {
					var stock_holding = {
						stock_name: stock,
						amount: parseFloat(stock_remaining)
					};
					stocks[index] = stock_holding;
					cash2[0] = cash_remaining;
				} else {
					stocks.splice(index, 1);
					cash2[0] = cash_remaining;
				}
				var log = {
					datetime: new Date().toString(),
					stock_name: stock_name,
					qty: qty,
					total_sale: total_sale,
					type: "S",
					balance: cash_remaining
				};
				transactions.push(log);
				db.collection("user_accounts").updateOne(
					{ _id: ObjectID(_id) },
					{ $set: { cash2: cash2, stocks: stocks, transactions: transactions } }
				);
				message = `You successfully sold ${qty} shares of ${stock_name} (${stock}) at $${stock_price}/share for $${total_sale}.`;
			} else {
				message = `You need to sell at least 1 share of ${stock}.`;
			}
		} catch (err) {
			if (stock === "") {
				message = `You cannot leave the sell input blank. Please input a stock ticker`;
			} else {
				console.log(err)
				message = `You do not own any shares with the ticker '${stock}'.`;
			}
		}
		switch (ssn.preference) {
			case "stock":
				var marqueeData = ssn.stockDataList;
				break;
			case "currency":
				var marqueeData = ssn.currencyDataList;
				break;
		}
		response.render("trading-success.hbs", {
			title: message,
			head: `Cash balance: $${cash2[0]}`,
			marqueeData: marqueeData,
			display: "Trading",
			preference: ssn.preference
		});

		function check_existence(stock) {
			var index = -1;
			for (i = 0; i < stocks.length; i++) {
				console.log(stocks[i].stock_name === stock)
				if (stocks[i].stock_name === stock) {
					index = i;
				}
			}
			return index;
		}
	})






function isAuthenticated(request, response, next) {
	if (request.session.passport !== undefined) {
		console.log(request.session.passport);
		next();
	} else {
		response.redirect('/');
	}
}
module.exports = router;