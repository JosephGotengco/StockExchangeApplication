const express = require("express");
var axios = require("axios");
var ObjectID = require("mongodb").ObjectID;
var utils = require("../utils");
var ssn;
// function for getting stock data for the graph
var stockFunc = require("../feature_functions/chartStockData");
// function for getting currency data for the graph
var currFunc = require("../feature_functions/chartCurrData");
// function for getting stock data for the marquee element
var marqueeStock = require("../feature_functions/MarqueeStock");
// function for getting the currency data for the marquee element
var marqueeCurrency = require("../feature_functions/MarqueeCurrency");
// function for getting a single stock's price
var getBatch = require("../feature_functions/getBatchPrice");
// function for converting monetary values
var convert = require("../feature_functions/getRates");
// function for retrieving symbols for currency codes
const rate_symbols = require('../feature_functions/rate_symbols');

const router = new express.Router();

router.route("/news-hub")
	.get(isAuthenticated, async (request, response) => {
		var ssn = request.session.passport.user;

		currency_preference = ssn.currency_preference

		var rates = await convert();
		var preference = ssn.currency_preference;
		var rate = rates[preference];
        var currency_symbol = rate_symbols.getCurrencySymbol(preference);

		if (ssn.stockDataList === undefined) {
			var stockDataList = await marqueeStock.getMarqueeStock();
			ssn.stockDataList = stockDataList;
		}

		var currencyDataList = clone(ssn.currencyDataList);
		var stockDataList = clone(ssn.stockDataList);

		currencyDataList.forEach((val, i) => {
			var price = parseFloat(val.price);
			var converted_price = rate / price;
			val.price = converted_price
		})

		stockDataList.forEach((val, i) => {
			var price = val.price;
			var converted_price = price * rate;
			val.price = converted_price;
		});

		response.render("news-hub.hbs", {
			title: "Stock and Currency.",
			currencyDataList: currencyDataList,
			stockDataList: stockDataList,
			display: "Ranking",
			currency_preference: currency_preference,
			currency_symbol: currency_symbol
		});
	})
	.post(isAuthenticated, async (request, response) => {
		var ssn = request.session.passport.user;
	
		ssn.currency_preference = request.body.currency_preference;
		currency_preference = ssn.currency_preference
	
		var rates = await convert();
		var preference = ssn.currency_preference;
		var rate = rates[preference];
        var currency_symbol = rate_symbols.getCurrencySymbol(preference);
	
		if (ssn.stockDataList === undefined) {
			var stockDataList = await marqueeStock.getMarqueeStock();
			ssn.stockDataList = stockDataList;
		}
	
		var currencyDataList = clone(ssn.currencyDataList);
		var stockDataList = clone(ssn.stockDataList);
	
		currencyDataList.forEach((val, i) => {
			var price = parseFloat(val.price);
			var converted_price = rate / price;
			val.price = converted_price
		})
	
		stockDataList.forEach((val, i) => {
			var price = val.price;
			var converted_price = price * rate;
			val.price = converted_price;
		});
	
		response.render("news-hub.hbs", {
			title: "Stock and Currency.",
			currencyDataList: currencyDataList,
			stockDataList: stockDataList,
			display: "Ranking",
			currency_preference: currency_preference,
			currency_symbol: currency_symbol
		});
	});
	

router
	.route("/news/currency/:id")
	.get(isAuthenticated, async (request, response) => {
		try {
			var currency_code = request.params.id;
			var ssn = request.session.passport.user;

			var chart_data = await currFunc.getCurrData(currency_code);

			var labels = Object.keys(chart_data);
			var data = Object.values(chart_data);

			var rates = await convert();
			var preference = ssn.currency_preference;
			var rate = rates[preference];
			var currency_symbol = rate_symbols.getCurrencySymbol(preference);

			for (i = 0; i < data.length; i++) {
				var price = data[i];
				data[i] = rate / price;
			}

			response.render("currency-info.hbs", {
				title: "Welcome to the trading page.",
				chart_title: `${currency_code} Price`,
				labels: labels,
				data: data,
				display: `${currency_code} Price`,
				currency_code: currency_code,
				currency_symbol: currency_symbol,
				currency_preference: preference
			});
		} catch (e) {
			console.error(e);
		}
	})
	.post(isAuthenticated, async (request, response) => {
		try {
			var currency_code = request.params.id;
			var ssn = request.session.passport.user;

			var chart_data = await currFunc.getCurrData(currency_code);

			var labels = Object.keys(chart_data);
			var data = Object.values(chart_data);

			ssn.currency_preference = request.body.currency_preference;
			currency_preference = ssn.currency_preference

			var rates = await convert();
			var preference = ssn.currency_preference;
			var rate = rates[preference];
			var currency_symbol = rate_symbols.getCurrencySymbol(preference);

			for (i = 0; i < data.length; i++) {
				var price = data[i];
				data[i] = rate / price;
			}

			response.render("currency-info.hbs", {
				title: "Welcome to the trading page.",
				chart_title: `${currency_code} Price`,
				labels: labels,
				data: data,
				display: `${currency_code} Price`,
				currency_code: currency_code,
				currency_symbol: currency_symbol,
				currency_preference: currency_preference
			});
		} catch (e) {
			console.error(e);
		}
	})

router
	.route("/news/stock/:id")
	.get(isAuthenticated, async (request, response) => {
		try {
			var ticker = request.params.id;
			var ssn = request.session.passport.user;

			var chart_data = await stockFunc.getStockData(ticker);

			var labels = Object.keys(chart_data);
			var data = Object.values(chart_data)

			var rates = await convert();
			var preference = ssn.currency_preference;
			var rate = rates[preference];
			var currency_symbol = rate_symbols.getCurrencySymbol(preference);

			for (i = 0; i < data.length; i++) {
				var price = data[i];
				data[i] = price * rate;
			}

			response.render("stock-info.hbs", {
				title: "Welcome to the trading page.",
				chart_title: `${ticker} Price`,
				labels: labels,
				data: data,
				display: `${ticker} Price`,
				ticker: ticker,
				currency_code: preference,
				currency_symbol: currency_symbol
			});
		} catch (e) {
			console.error(e);
		}
	})
	.post(isAuthenticated, async (request, response) => {
		try {
			var ticker = request.params.id;
			var ssn = request.session.passport.user;

			var chart_data = await stockFunc.getStockData(ticker);

			var labels = Object.keys(chart_data);
			var data = Object.values(chart_data);
			
			ssn.currency_preference = request.body.currency_preference;
			currency_preference = ssn.currency_preference

			var rates = await convert();
			var preference = ssn.currency_preference;
			var rate = rates[preference];
			var currency_symbol = rate_symbols.getCurrencySymbol(preference);

			for (i = 0; i < data.length; i++) {
				var price = data[i];
				data[i] = price * rate;
			}

			response.render("stock-info.hbs", {
				title: "Welcome to the trading page.",
				chart_title: `${ticker} Price`,
				labels: labels,
				data: data,
				display: `${ticker} Price`,
				currency_code: preference,
				currency_symbol: currency_symbol,
				ticker: ticker
			});
		} catch (e) {
			console.error(e);
		}
	})

router.route("/trading").get((request, response) => {
	response.render("trading.hbs", {
		title: "You are not logged in. You must be logged in to view this page.",
		display: "Trading"
	});
});

router
	.route("/convert/currency")
	.post(isAuthenticated, async (request, response) => {
		try {
			var ssn = request.session.passport.user;

			ssn.currency_preference = request.body.currency_preference;
			var currency_preference = ssn.currency_preference;

			var cash2 = ssn.cash2;
			var uniqueTransactions = ssn.userStatsData.uniqueTransactions;
			var userStocks = ssn.stocks;
			var currency_symbol = rate_symbols.getCurrencySymbol(currency_preference);



			switch (ssn.preference) {
				case "stock":
					var marqueeData = ssn.stockDataList;
					break;
				case "currency":
					var marqueeData = ssn.currencyDataList;
					break;
			}


			var rates = await convert();
			var preference = ssn.currency_preference;
			var rate = rates[preference];

			var displayTransactions = clone(uniqueTransactions);
			displayTransactions.forEach((val, i) => {
				var total_cost = val.total_cost;
				displayTransactions[i].total_cost = rate * total_cost;
				var balance = val.balance;
				displayTransactions[i].balance = rate * balance;
			})

			var displayStocks = clone(userStocks)
			displayStocks.forEach((val, i) => {
				var total_cost = val.total_cost;
				displayStocks[i].total_cost = rate * total_cost;
				var today_rate = val.today_rate;
				displayStocks[i].today_rate = rate * today_rate;
				var profit = val.profit;
				displayStocks[i].profit = rate * profit;
			})



			var displayMarqueeData = clone(marqueeData);
			displayMarqueeData.forEach((val, i) => {
				var price = val.price;
				var price = parseFloat(price);
				displayMarqueeData[i].price = rate * price;
			})



			response.render("trading-success.hbs", {
				title: "Welcome to the trading page.",
				marqueeData: displayMarqueeData,
				display: "Trading",
				preference: ssn.preference,
				userCash: cash2[0] * rate,
				num_stocks: ssn.userStatsData.num_stocks,
				num_transactions: ssn.userStatsData.num_transactions,
				earnings: ssn.userStatsData.earnings * rate,
				amountBought: ssn.userStatsData.amountBought,
				amountSold: ssn.userStatsData.amountSold,
				stocks: displayStocks,
				uniqueTransactions: displayTransactions.slice(
					-5,
					displayTransactions.length
				),
				currency_preference: currency_preference,
				currency_symbol: currency_symbol
			});
		} catch (err) {
			console.log(err);
		}
	});

router
	.route("/trading-success")
	.get(isAuthenticated, async (request, response) => {
		try {
			var ssn = request.session.passport.user;

			if (ssn.currency_preference === undefined) {
				ssn.currency_preference = "USD";
			}

			var currency_preference = ssn.currency_preference;

			var cash2 = ssn.cash2;
			var stocks = ssn.stocks;
			var num_stocks = ssn.stocks.length;
			var transactions = ssn.transactions;
			var num_transactions = transactions.length;
			var earnings = countTotalSale(transactions);			
			var amountBought = countStocksBought(transactions);
			var amountSold = countStocksSold(transactions);
			var uniqueTransactions = getUniqueTransactions(transactions);
			ssn.userStatsData = {
				num_stocks: num_stocks,
				num_transactions: num_transactions,
				earnings: earnings,
				amountBought: amountBought,
				amountSold: amountSold,
				uniqueTransactions: uniqueTransactions
			};

			var defaultPreference = "currency";
			if (ssn.preference === undefined) {
				ssn.preference = defaultPreference;
			}

			if (ssn.currencyDataList === undefined) {
				var currencyDataList = await marqueeCurrency.getMarqueeCurrency();
				ssn.currencyDataList = currencyDataList;
				marqueeData = ssn.currencyDataList;
				ssn.preference = "currency";
			}

			switch (ssn.preference) {
				case "stock":
					var marqueeData = ssn.stockDataList;
					break;
				case "currency":
					var marqueeData = ssn.currencyDataList;
					break;
			}

			var stock_names = [];
			var userStocks = [];
			var stock_tickers = "";

			if (stocks.length > 0) {
				for (i = 0; i < stocks.length; i++) {
					stock_tickers += `${stocks[i].stock_name},`;
					stock_names.push(stocks[i].stock_name);
				}
				var closing_price = await getBatch.getBatchClosePrice(stock_tickers);
				ssn.closing_price = closing_price;
				for (i = 0; i < stocks.length; i++) {
					userStocks[i] = stocks[i];
					var today_price = closing_price[stock_names[i]];
					userStocks[i].profit = (
						userStocks[i].total_cost -
						today_price * userStocks[i].amount
					).toFixed(2);
					userStocks[i].today_rate = today_price;
				}
				ssn.userStockData = {
					userStocks: userStocks
				};
			} else {
				ssn.userStockData = { userStocks: userStocks };
			}

			var rates = await convert();
			var preference = ssn.currency_preference;
			var rate = rates[preference];
			var currency_symbol = rate_symbols.getCurrencySymbol(preference);

			var displayTransactions = clone(uniqueTransactions)
			displayTransactions.forEach((val, i) => {
				var total_cost = val.total_cost;
				displayTransactions[i].total_cost = rate * total_cost;
				var balance = val.balance;
				displayTransactions[i].balance = rate * balance;
			})

			var displayStocks = clone(userStocks)
			displayStocks.forEach((val, i) => {
				var total_cost = val.total_cost;
				displayStocks[i].total_cost = rate * total_cost;
				var today_rate = val.today_rate;
				displayStocks[i].today_rate = rate * today_rate;
				var profit = val.profit;
				displayStocks[i].profit = rate * profit;
			})

			var displayMarqueeData = clone(marqueeData);
			displayMarqueeData.forEach((val, i) => {
				var price = val.price;
				var price = parseFloat(price);
				displayMarqueeData[i].price = rate * price;
			})

			response.render("trading-success.hbs", {
				title: "Welcome to the trading page.",
				marqueeData: displayMarqueeData,
				display: "Trading",
				preference: ssn.preference,
				userCash: cash2[0] * rate,
				num_stocks: ssn.userStatsData.num_stocks,
				num_transactions: ssn.userStatsData.num_transactions,
				earnings: ssn.userStatsData.earnings * rate,
				amountBought: ssn.userStatsData.amountBought,
				amountSold: ssn.userStatsData.amountSold,
				stocks: displayStocks,
				uniqueTransactions: displayTransactions.slice(
					-5,
					displayTransactions.length
				),
				currency_preference: currency_preference,
				currency_symbol: currency_symbol
			});
		} catch (err) {
			console.log(err);
		}
	});

router
	.route("/trading-success-stocks")
	.post(isAuthenticated, async (request, response) => {
		try {
			ssn = request.session.passport.user;

			var currency_preference = ssn.currency_preference;

			var cash2 = ssn.cash2;
			var uniqueTransactions = ssn.userStatsData.uniqueTransactions;
			var userStocks = ssn.stocks;
			var num_stocks = ssn.stocks.length;
			var transactions = ssn.transactions;
			var num_transactions = transactions.length;
			var earnings = countTotalSale(transactions)			
			var amountBought = countStocksBought(transactions);
			var amountSold = countStocksSold(transactions);
			var uniqueTransactions = getUniqueTransactions(transactions);
			ssn.userStatsData = {
				num_stocks: num_stocks,
				num_transactions: num_transactions,
				earnings: earnings,
				amountBought: amountBought,
				amountSold: amountSold,
				uniqueTransactions: uniqueTransactions
			};

			ssn.preference = "stock";
			if (ssn.stockDataList === undefined) {
				var stockDataList = await marqueeStock.getMarqueeStock();
				ssn.stockDataList = stockDataList;
			}

			var rates = await convert();
			var preference = ssn.currency_preference;
			var rate = rates[preference];
			var currency_symbol = rate_symbols.getCurrencySymbol(preference);

			switch (ssn.preference) {
				case "stock":
					var marqueeData = ssn.stockDataList;
					break;
				case "currency":
					var marqueeData = ssn.currencyDataList;
					break;
			}

			var displayTransactions = clone(uniqueTransactions)
			displayTransactions.forEach((val, i) => {
				var total_cost = val.total_cost;
				displayTransactions[i].total_cost = rate * total_cost;
				var balance = val.balance;
				displayTransactions[i].balance = rate * balance;
			})

			var displayStocks = clone(userStocks)
			displayStocks.forEach((val, i) => {
				var total_cost = val.total_cost;
				displayStocks[i].total_cost = rate * total_cost;
				var today_rate = val.today_rate;
				displayStocks[i].today_rate = rate * today_rate;
				var profit = val.profit;
				displayStocks[i].profit = rate * profit;
			})



			var displayMarqueeData = clone(marqueeData);
			displayMarqueeData.forEach((val, i) => {
				var price = val.price;
				var price = parseFloat(price);
				displayMarqueeData[i].price = rate * price;
			})

			response.render("trading-success.hbs", {
				title: "Welcome to the trading page.",
				marqueeData: displayMarqueeData,
				display: "Trading",
				preference: ssn.preference,
				userCash: cash2[0] * rate,
				num_stocks: ssn.userStatsData.num_stocks,
				num_transactions: ssn.userStatsData.num_transactions,
				earnings: ssn.userStatsData.earnings * rate,
				amountBought: ssn.userStatsData.amountBought,
				amountSold: ssn.userStatsData.amountSold,
				stocks: displayStocks,
				uniqueTransactions: displayTransactions.slice(
					-5,
					displayTransactions.length
				),
				currency_preference: currency_preference,
				currency_symbol: currency_symbol
			});
		} catch (err) {
			console.log(err);
		}
	});


router
	.route("/trading-success-currency")
	.post(isAuthenticated, async (request, response) => {
		try {
			var ssn = request.session.passport.user;

			var currency_preference = ssn.currency_preference;

			var cash2 = ssn.cash2;
			var uniqueTransactions = ssn.userStatsData.uniqueTransactions;
			var userStocks = ssn.stocks;
			var num_stocks = ssn.stocks.length;
			var transactions = ssn.transactions;
			var num_transactions = transactions.length;
			var earnings = countTotalSale(transactions);			
			var amountBought = countStocksBought(transactions);
			var amountSold = countStocksSold(transactions);
			var uniqueTransactions = getUniqueTransactions(transactions);
			ssn.userStatsData = {
				num_stocks: num_stocks,
				num_transactions: num_transactions,
				earnings: earnings,
				amountBought: amountBought,
				amountSold: amountSold,
				uniqueTransactions: uniqueTransactions
			};

			var rates = await convert();
			var preference = ssn.currency_preference;
			var rate = rates[preference];
			var currency_symbol = rate_symbols.getCurrencySymbol(preference);

			ssn.preference = "currency";
			switch (ssn.preference) {
				case "stock":
					var marqueeData = ssn.stockDataList;
					break;
				case "currency":
					var marqueeData = ssn.currencyDataList;
					break;
			}

			var displayTransactions = clone(uniqueTransactions)
			displayTransactions.forEach((val, i) => {
				var total_cost = val.total_cost;
				displayTransactions[i].total_cost = rate * total_cost;
				var balance = val.balance;
				displayTransactions[i].balance = rate * balance;
			})

			var displayStocks = clone(userStocks)
			displayStocks.forEach((val, i) => {
				var total_cost = val.total_cost;
				displayStocks[i].total_cost = rate * total_cost;
				var today_rate = val.today_rate;
				displayStocks[i].today_rate = rate * today_rate;
				var profit = val.profit;
				displayStocks[i].profit = rate * profit;
			})



			var displayMarqueeData = clone(marqueeData);
			displayMarqueeData.forEach((val, i) => {
				var price = val.price;
				var price = parseFloat(price);
				displayMarqueeData[i].price = rate * price;
			})

			response.render("trading-success.hbs", {
				title: "Welcome to the trading page.",
				marqueeData: displayMarqueeData,
				display: "Trading",
				preference: ssn.preference,
				userCash: cash2[0] * rate,
				num_stocks: ssn.userStatsData.num_stocks,
				num_transactions: ssn.userStatsData.num_transactions,
				earnings: ssn.userStatsData.earnings * rate,
				amountBought: ssn.userStatsData.amountBought,
				amountSold: ssn.userStatsData.amountSold,
				stocks: displayStocks,
				uniqueTransactions: displayTransactions.slice(
					-5,
					displayTransactions.length
				),
				currency_preference: currency_preference,
				currency_symbol: currency_symbol
			});
		} catch (err) {
			console.log(err);
		}
	});

router
	.route("/trading-success-search")
	.post(isAuthenticated, async (request, response) => {
		var ssn = request.session.passport.user;

		var currency_preference = ssn.currency_preference;

		var cash2 = ssn.cash2;
		var uniqueTransactions = ssn.userStatsData.uniqueTransactions;
		var userStocks = ssn.stocks;
		var num_stocks = ssn.stocks.length;
		var transactions = ssn.transactions;
		var num_transactions = transactions.length;
		var earnings = countTotalSale(transactions);			
		var amountBought = countStocksBought(transactions);
		var amountSold = countStocksSold(transactions);
		var uniqueTransactions = getUniqueTransactions(transactions);
		ssn.userStatsData = {
			num_stocks: num_stocks,
			num_transactions: num_transactions,
			earnings: earnings,
			amountBought: amountBought,
			amountSold: amountSold,
			uniqueTransactions: uniqueTransactions
		};
		
		var rates = await convert();
		var preference = ssn.currency_preference;
		var rate = rates[preference];
		var currency_symbol = rate_symbols.getCurrencySymbol(preference);

		var stock = request.body.stocksearch.toUpperCase();

		var message;

		try {
			const stock_info = await axios.get(
				`https://cloud.iexapis.com/beta/stock/${stock}/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`
			);
			var stock_name = stock_info.data.companyName;
			var stock_price = stock_info.data.close;



			message = `The price of the selected ticker '${stock}' which belongs to '${stock_name}' is currently: ${currency_symbol}${(stock_price * rate).toFixed(2)} ${currency_preference}.`;
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




		var displayTransactions = clone(uniqueTransactions)
		displayTransactions.forEach((val, i) => {
			var total_cost = val.total_cost;
			displayTransactions[i].total_cost = rate * total_cost;
			var balance = val.balance;
			displayTransactions[i].balance = rate * balance;
		})

		var displayStocks = clone(userStocks)
		displayStocks.forEach((val, i) => {
			var total_cost = val.total_cost;
			displayStocks[i].total_cost = rate * total_cost;
			var today_rate = val.today_rate;
			displayStocks[i].today_rate = rate * today_rate;
			var profit = val.profit;
			displayStocks[i].profit = rate * profit;
		})



		var displayMarqueeData = clone(marqueeData);
		displayMarqueeData.forEach((val, i) => {
			var price = val.price;
			var price = parseFloat(price);
			displayMarqueeData[i].price = rate * price;
		})



		response.render("trading-success.hbs", {
			title: message,
			head: `Cash balance: ${currency_symbol}${(cash2[0] * rate).toFixed(2)}`,
			marqueeData: displayMarqueeData,
			display: "Trading",
			preference: ssn.preference,
			userCash: cash2[0] * rate,
			num_stocks: ssn.userStatsData.num_stocks,
			num_transactions: ssn.userStatsData.num_transactions,
			earnings: ssn.userStatsData.earnings * rate,
			amountBought: ssn.userStatsData.amountBought,
			amountSold: ssn.userStatsData.amountSold,
			stocks: displayStocks,
			uniqueTransactions: displayTransactions.slice(
				-5,
				displayTransactions.length
			),
			currency_preference: currency_preference,
			currency_symbol: currency_symbol
		});
	});

router
	.route("/trading-success-buy")
	.post(isAuthenticated, async (request, response) => {
		var ssn = request.session.passport.user;

		var currency_preference = ssn.currency_preference;

		var _id = ssn._id;
		var cash2 = ssn.cash2;
		var stocks = ssn.stocks;
		var userStocks = ssn.stocks;
		var uniqueTransactions = ssn.userStatsData.uniqueTransactions;
		var num_stocks = ssn.stocks.length;
		var transactions = ssn.transactions;
		var num_transactions = transactions.length;
		var earnings = countTotalSale(transactions);

		var qty = parseFloat(request.body.buystockqty);
		var stock = request.body.buystockticker.toUpperCase();

		var rates = await convert();
		var preference = ssn.currency_preference;
		var rate = rates[preference];
		var currency_symbol = rate_symbols.getCurrencySymbol(preference);

		var index = check_existence(stock);
		var message;

		try {
			const stock_info = await axios.get(
				`https://cloud.iexapis.com/beta/stock/${stock}/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`
			);
			var stock_name = stock_info.data.companyName;
			var stock_price = stock_info.data.close;
			var total_cost = Math.round(stock_price * qty * 100) / 100;
			var cash_remaining = Math.round((cash2 - total_cost) * 100) / 100;



			if (cash_remaining >= 0 && total_cost !== 0 && qty > 0) {
				var db = utils.getDb();

				if (index >= 0) {
					var stock_qty = ssn.stocks[index].amount;
					var current_cost = ssn.stocks[index].total_cost;
					var stock_remaining = parseFloat(qty) + parseFloat(stock_qty);
					stock_holding = {
						stock_name: stock,
						amount: parseFloat(stock_remaining),
						total_cost: current_cost + total_cost
					};
					stocks[index] = stock_holding;
					cash2[0] = cash_remaining;
				} else {
					stock_holding = {
						stock_name: stock,
						amount: parseFloat(qty),
						total_cost: total_cost
					};
					cash2[0] = cash_remaining;
					stocks.push(stock_holding);
				}

				var log = {
					datetime: new Date().toString(),
					stock: stock,
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

				message = `You successfully purchased ${qty} shares of ${stock_name} (${stock}) at ${currency_symbol}${(stock_price * rate).toFixed(2)}/share for ${currency_symbol}${(total_cost * rate).toFixed(2)}.`;
			} else if (total_cost === 0) {
				message = `Sorry you need to purchase at least 1 stock. Change your quantity to 1 or more.`;
			} else if (qty < 0) {
				message = `You cannot buy negative shares.`;
			} else {
				message = `Sorry you only have ${currency_symbol}${
					(cash2[0] * rate).toFixed(2)
					}. The purchase did not go through. The total cost was ${currency_symbol}${(total_cost * rate).toFixed(2)}.`;
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

		var stock_names = [];
		var userStocks = [];
		var stock_tickers = "";

		if (stocks.length > 0) {
			for (i = 0; i < stocks.length; i++) {
				stock_tickers += `${stocks[i].stock_name},`;
				stock_names.push(stocks[i].stock_name);
			}
			var closing_price = await getBatch.getBatchClosePrice(stock_tickers);
			ssn.closing_price = closing_price;
			for (i = 0; i < stocks.length; i++) {
				userStocks[i] = stocks[i];
				var today_price = closing_price[stock_names[i]];
				userStocks[i].profit = (
					userStocks[i].total_cost -
					today_price * userStocks[i].amount
				).toFixed(2);
				userStocks[i].today_rate = today_price;
			}
			ssn.userStockData = {
				userStocks: userStocks
			};
		} else {
			ssn.userStockData = { userStocks: userStocks };
		}

		var displayTransactions = clone(uniqueTransactions)
		displayTransactions.forEach((val, i) => {
			var total_cost = val.total_cost;
			displayTransactions[i].total_cost = rate * total_cost;
			var balance = val.balance;
			displayTransactions[i].balance = rate * balance;
		})

		var displayStocks = clone(userStocks)
		displayStocks.forEach((val, i) => {
			var total_cost = val.total_cost;
			displayStocks[i].total_cost = rate * total_cost;
			var today_rate = val.today_rate;
			displayStocks[i].today_rate = rate * today_rate;
			var profit = val.profit;
			displayStocks[i].profit = rate * profit;
		})



		var displayMarqueeData = clone(marqueeData);
		displayMarqueeData.forEach((val, i) => {
			var price = val.price;
			var price = parseFloat(price);
			displayMarqueeData[i].price = rate * price;
		})

		var amountBought = countStocksBought(transactions);

		var amountSold = countStocksSold(transactions);

		var uniqueTransactions = getUniqueTransactions(transactions);

		ssn.userStatsData = {
			num_stocks: num_stocks,
			num_transactions: num_transactions,
			earnings: earnings,
			amountBought: amountBought,
			amountSold: amountSold,
			uniqueTransactions: uniqueTransactions
		};

		response.render("trading-success.hbs", {
			title: message,
			head: `Cash balance: ${currency_symbol}${(cash2[0] * rate).toFixed(2)}`,
			marqueeData: displayMarqueeData,
			display: "Trading",
			preference: ssn.preference,
			userCash: cash2[0] * rate,
			num_stocks: ssn.userStatsData.num_stocks,
			num_transactions: ssn.userStatsData.num_transactions,
			earnings: ssn.userStatsData.earnings * rate,
			amountBought: ssn.userStatsData.amountBought,
			amountSold: ssn.userStatsData.amountSold,
			stocks: displayStocks,
			uniqueTransactions: displayTransactions.slice(
				-5,
				displayTransactions.length
			),
			currency_preference: currency_preference,
			currency_symbol: currency_symbol
		});

		function check_existence(stock) {
			var index = -1;

			for (i = 0; i < stocks.length; i++) {
				if (stocks[i].stock_name === stock) {
					index = i;
				}
			}

			return index;
		}
	});

router
	.route("/trading-success-sell")
	.post(isAuthenticated, async (request, response) => {
		var ssn = request.session.passport.user;

		var currency_preference = ssn.currency_preference;

		var _id = ssn._id;
		var cash2 = ssn.cash2;
		var transactions = ssn.transactions;
		var num_transactions = transactions.length;
		var stocks = ssn.stocks;
		var userStocks = ssn.stocks;
		var uniqueTransactions = ssn.userStatsData.uniqueTransactions;
		var num_stocks = ssn.stocks.length;


		var qty = parseFloat(request.body.sellstockqty);
		var stock = request.body.sellstockticker.toUpperCase();

		var rates = await convert();
		var preference = ssn.currency_preference;
		var rate = rates[preference];
		var currency_symbol = rate_symbols.getCurrencySymbol(preference);

		var index = check_existence(stock);
		var message;

		try {
			const stock_info = await axios.get(
				`https://cloud.iexapis.com/beta/stock/${stock}/quote?token=sk_291eaf03571b4f0489b0198ac1af487d`
			);

			var stock_name = stock_info.data.companyName;
			var stock_price = stock_info.data.close;
			var total_sale = Math.round(stock_price * qty * 100) / 100;
			var cash_remaining = Math.round((cash2[0] + total_sale) * 100) / 100;
			if (ssn.stocks[index] !== undefined) {
				var stock_qty = ssn.stocks[index].amount;
				var current_cost = ssn.stocks[index].total_cost;
			} else {
				throw "You have no stocks.";
			}
			var stock_remaining = stock_qty - qty;

			var amountBought = countStocksBought(transactions);

			var amountSold = countStocksSold(transactions);
	
			var uniqueTransactions = getUniqueTransactions(transactions);
			ssn.userStatsData = {
				num_stocks: num_stocks,
				num_transactions: num_transactions,
				earnings: earnings,
				amountBought: amountBought,
				amountSold: amountSold,
				uniqueTransactions: uniqueTransactions
			};

			if (stock_qty < qty) {
				message = `You are trying to sell ${qty} shares of ${stock} when you only have ${stock_qty} shares.`;
			} else if (stock_qty >= qty && total_sale > 0) {
				var db = utils.getDb();

				if (stock_remaining > 0) {
					var stock_holding = {
						stock_name: stock,
						amount: parseFloat(stock_remaining),
						total_cost: current_cost - total_sale
					};
					stocks[index] = stock_holding;
					cash2[0] = cash_remaining;
				} else {
					stocks.splice(index, 1);
					cash2[0] = cash_remaining;
				}
				var log = {
					datetime: new Date().toString(),
					stock: stock,
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
				message = `You successfully sold ${qty} shares of ${stock_name} (${stock}) at ${currency_symbol}${(stock_price * rate).toFixed(2)}/share for ${currency_symbol}${(total_sale * rate).toFixed(2)}.`;
			} else {
				message = `You need to sell at least 1 share of ${stock}.`;
			}
		} catch (err) {
			if (stock === "") {
				message = `You cannot leave the sell input blank. Please input a stock ticker`;
			} else {
				// console.log(err);
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

		var stock_names = [];
		var userStocks = [];
		var stock_tickers = "";

		if (stocks.length > 0) {
			for (i = 0; i < stocks.length; i++) {
				stock_tickers += `${stocks[i].stock_name},`;
				stock_names.push(stocks[i].stock_name);
			}
			var closing_price = await getBatch.getBatchClosePrice(stock_tickers);
			ssn.closing_price = closing_price;
			for (i = 0; i < stocks.length; i++) {
				userStocks[i] = stocks[i];
				var today_price = closing_price[stock_names[i]];
				userStocks[i].profit = (
					userStocks[i].total_cost -
					today_price * userStocks[i].amount
				).toFixed(2);

				userStocks[i].today_rate = today_price;
			}
			ssn.userStockData = {
				userStocks: userStocks
			};
		} else {
			ssn.userStockData = { userStocks: userStocks };
		}

		var displayTransactions = clone(uniqueTransactions)
		displayTransactions.forEach((val, i) => {
			var total_cost = val.total_cost;
			displayTransactions[i].total_cost = rate * total_cost;
			var balance = val.balance;
			displayTransactions[i].balance = rate * balance;
		})

		var displayStocks = clone(userStocks)
		displayStocks.forEach((val, i) => {
			var total_cost = val.total_cost;
			displayStocks[i].total_cost = rate * total_cost;
			var today_rate = val.today_rate;
			displayStocks[i].today_rate = rate * today_rate;
			var profit = val.profit;
			displayStocks[i].profit = rate * profit;
		})

		var displayMarqueeData = clone(marqueeData);
		displayMarqueeData.forEach((val, i) => {
			var price = val.price;
			var price = parseFloat(price);
			displayMarqueeData[i].price = rate * price;
		})

		var amountBought = countStocksBought(transactions);

		var amountSold = countStocksSold(transactions);

		var uniqueTransactions = getUniqueTransactions(transactions);

		var earnings = countTotalSale(transactions);			

		ssn.userStatsData = {
			num_stocks: num_stocks,
			num_transactions: num_transactions,
			earnings: earnings,
			amountBought: amountBought,
			amountSold: amountSold,
			uniqueTransactions: uniqueTransactions
		};

		response.render("trading-success.hbs", {
			title: message,
			head: `Cash balance: ${currency_symbol}${cash2[0] * rate}`,
			marqueeData: displayMarqueeData,
			display: "Trading",
			preference: ssn.preference,
			userCash: cash2[0] * rate,
			num_stocks: ssn.userStatsData.num_stocks,
			num_transactions: ssn.userStatsData.num_transactions,
			earnings: ssn.userStatsData.earnings * rate,
			amountBought: ssn.userStatsData.amountBought,
			amountSold: ssn.userStatsData.amountSold,
			stocks: displayStocks,
			uniqueTransactions: displayTransactions.slice(
				-5,
				displayTransactions.length
			),
			currency_preference: currency_preference,
			currency_symbol: currency_symbol
		});

		function check_existence(stock) {
			var index = -1;
			for (i = 0; i < stocks.length; i++) {
				if (stocks[i].stock_name === stock) {
					index = i;
				}
			}
			return index;
		}
	});

function clone(src) {
	return JSON.parse(JSON.stringify(src));
}

function countStocksSold(transactionArray) {
	var amountSold = 0;
	for (i = 0; i < transactionArray.length; i++) {
		if (transactionArray[i].type === "S") {
			amountSold += transactionArray[i].qty;
		}
	}
	return amountSold;
}


function countStocksBought(transactionArray) {
	var amountBought = 0;
	for (i = 0; i < transactionArray.length; i++) {
		if (transactionArray[i].type === "B") {
			amountBought += transactionArray[i].qty;
		}
	}
	return amountBought;
}

function getUniqueTransactions(transactionArray) {
	var uniqueTicker = [];
	var uniqueTransactions = [];
	for (i = 0; i < transactionArray.length; i++) {
		var currentStock = transactionArray[i].stock;
		if (uniqueTicker.includes(currentStock)) {
		} else {
			uniqueTicker.push(currentStock);
			uniqueTransactions.push(transactionArray[i]);
		}
	}
	return uniqueTransactions;
}

function countTotalSale(transactionArray) {
	var total_sale = 0;
	for (i = 0; i < transactionArray.length; i++) {
		if (transactionArray[i].type === "S") {
			total_sale += transactionArray[i].total_sale;
		}
	}
	return total_sale;
}

// function countTotalPurchase(transactionArray) {
// 	var total_purchase = 0;
// 	for (i = 0; i < transactionArray.length; i++) {
// 		if (transactionArray[i].type === "B") {
// 			total_purchase += transactionArray[i].total_purchase;
// 		}
// 	}
// 	return total_purchase;
// }

function isAuthenticated(request, response, next) {
	if (request.session.passport !== undefined) {
		next();
	} else {
		response.redirect("/");
	}
}


module.exports = router;
