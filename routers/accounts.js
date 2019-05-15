const express = require('express');
// function for converting monetary values
var convert = require("../feature_functions/getRates");
// function for retrieving symbols for currency codes
const rate_symbols = require('../feature_functions/rate_symbols');
// function for getting a single stock's price
var getBatch = require("../feature_functions/getBatchPrice");
const router = new express.Router();


router
    .route("/trading-portfolio")
    .get(isAuthenticated, async(request, response) => {
        var ssn = request.session.passport.user;

        currency_preference = ssn.currency_preference

        var cash2 = ssn.cash2;
        var earnings = cash2 - 10000;
        var stocks = ssn.stocks;
        var num_stocks = ssn.stocks.length;
        var transactions = ssn.transactions;
        var num_transactions = transactions.length;
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

        var date_joined = ssn.creation_date.split(" ");
        var date_joined = 
        {
        day_joined: date_joined[0],
        month_joined: date_joined[1],
        day_num_joined: date_joined[2],
        year_joined: date_joined[3]
        }

        var firstname = ssn.firstname;
        var lastname = ssn.lastname;
        var username = ssn.username;
        var stocks = ssn.stocks;
        var num_stocks = stocks.length;
        var message = "Shares: \n";
        var cash2 = ssn.cash2;
        var earnings = cash2 - 10000;
        var transactions = ssn.transactions;
        var num_transactions = transactions.length;

        var rates = await convert();
        var preference = ssn.currency_preference;
        var rate = rates[preference];
        var currency_symbol = rate_symbols.getCurrencySymbol(preference);


        if (num_stocks === 0) {
            message = "You currently do not have any stocks.";
        } else {
            message = stocks;
        }
        if (num_transactions === 0) {
            transact_message = "You currently do not have any transactions";
        } else {
            var displayTransactions = [];
            for (i = 0; i < num_transactions; i++) {
                var log = transactions[i];
                var datetimeArr = log.datetime.split(" ");
                var month = datetimeArr[1];
                var day = datetimeArr[2];
                var year = datetimeArr[3];
                var stock_name = log.stock_name;
                var qty = log.qty;
                var type = log.type;
                var balance = log.balance;
                if (type === "B") {
                    var price = log.total_cost;
                } else {
                    var price = log.total_sale;
                }
    
                displayLog = {
                    year: year,
                    month: month,
                    day: day,
                    stock_name: stock_name,
                    qty: qty,
                    type: type,
                    price: price * rate,
                    balance: balance * rate
                };
    
                displayTransactions.push(displayLog);
            }
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

        var displayStocks = clone(userStocks)
        displayStocks.forEach((val, i) => {
            var total_cost = val.total_cost;
            displayStocks[i].total_cost = rate * total_cost;
            var today_rate = val.today_rate;
            displayStocks[i].today_rate = rate * today_rate;
        })

        response.render("trading-portfolio.hbs", {
            title: message,
            head: cash2[0] * rate,
            earnings: earnings * rate,
            display: "Portfolio",
            displayTransactions: displayTransactions,
            userStocks: stocks,
            stocks: displayStocks,
            currency_symbol: currency_symbol,
            currency_code: preference,
            firstname: firstname,
            lastname: lastname,
            username: username,
            date_joined: date_joined,
            userStatsData: ssn.userStatsData,
            currency_preference: currency_preference
        });
    })
    .post(isAuthenticated, async(request, response) => {
        var ssn = request.session.passport.user;

        ssn.currency_preference = request.body.currency_preference;
        currency_preference = ssn.currency_preference

        var cash2 = ssn.cash2;
        var earnings = cash2 - 10000;
        var stocks = ssn.stocks;
        var num_stocks = ssn.stocks.length;
        var transactions = ssn.transactions;
        var num_transactions = transactions.length;
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

        var date_joined = ssn.creation_date.split(" ");
        var date_joined = 
        {
        day_joined: date_joined[0],
        month_joined: date_joined[1],
        day_num_joined: date_joined[2],
        year_joined: date_joined[3]
        }

        var firstname = ssn.firstname;
        var lastname = ssn.lastname;
        var username = ssn.username;
        var stocks = ssn.stocks;
        var num_stocks = stocks.length;
        var message = "Shares: \n";
        var cash2 = ssn.cash2;
        var earnings = cash2 - 10000;
        var transactions = ssn.transactions;
        var num_transactions = transactions.length;

        var rates = await convert();
        var preference = ssn.currency_preference;
        var rate = rates[preference];
        var currency_symbol = rate_symbols.getCurrencySymbol(preference);


        if (num_stocks === 0) {
            message = "You currently do not have any stocks.";
        } else {
            message = stocks;
        }
        if (num_transactions === 0) {
            transact_message = "You currently do not have any transactions";
        } else {
            var displayTransactions = [];
            for (i = 0; i < num_transactions; i++) {
                var log = transactions[i];
                var datetimeArr = log.datetime.split(" ");
                var month = datetimeArr[1];
                var day = datetimeArr[2];
                var year = datetimeArr[3];
                var stock_name = log.stock_name;
                var qty = log.qty;
                var type = log.type;
                var balance = log.balance;
                if (type === "B") {
                    var price = log.total_cost;
                } else {
                    var price = log.total_sale;
                }
    
                displayLog = {
                    year: year,
                    month: month,
                    day: day,
                    stock_name: stock_name,
                    qty: qty,
                    type: type,
                    price: price * rate,
                    balance: balance * rate
                };
    
                displayTransactions.push(displayLog);
            }
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

        var displayStocks = clone(userStocks)
        displayStocks.forEach((val, i) => {
            var total_cost = val.total_cost;
            displayStocks[i].total_cost = rate * total_cost;
            var today_rate = val.today_rate;
            displayStocks[i].today_rate = rate * today_rate;
        })

        response.render("trading-portfolio.hbs", {
            title: message,
            head: cash2[0] * rate,
            earnings: earnings * rate,
            display: "Portfolio",
            displayTransactions: displayTransactions,
            userStocks: stocks,
            stocks: displayStocks,
            currency_symbol: currency_symbol,
            currency_code: preference,
            firstname: firstname,
            lastname: lastname,
            username: username,
            date_joined: date_joined,
            userStatsData: ssn.userStatsData,
            currency_preference: currency_preference
        });
    })

    
// router
//     .route("/trading-portfolio-holdings")
//     .post(isAuthenticated, (request, response) => {
//         var ssn = request.session.passport.user;

//         var stocks = ssn.stocks;
//         var num_stocks = stocks.length;
//         var message = "Shares: \n";
//         var cash2 = ssn.cash2;
//         var transactions = ssn.transactions;
//         var num_transactions = transactions.length;

//         if (num_stocks === 0) {
//             message = "You currently do not have any stocks.";
//         } else {
//             message = stocks;
//         }
//         if (num_transactions === 0) {
//             transact_message = "You currently do not have any transactions";
//         } else {
//             var displayTransactions = [];
//             for (i = 0; i < num_transactions; i++) {
//                 var log = transactions[i];
//                 var datetimeArr = log.datetime.split(" ");
//                 var month = datetimeArr[1];
//                 var day = datetimeArr[2];
//                 var year = datetimeArr[3];
//                 var stock_name = log.stock_name;
//                 var qty = log.qty;
//                 var type = log.type;
//                 var balance = log.balance;
//                 if (type === "B") {
//                     var price = log.total_cost;
//                 } else {
//                     var price = log.total_sale;
//                 }

//                 displayLog = {
//                     year: year,
//                     month: month,
//                     day: day,
//                     stock_name: stock_name,
//                     qty: qty,
//                     type: type,
//                     price: price,
//                     balance: balance
//                 };

//                 displayTransactions.push(displayLog);
//             }
//         }

        
//         response.render("trading-portfolio.hbs", {
//             title: message,
//             head: cash2[0],
//             display: "Portfolio",
//             displayTransactions: displayTransactions,
//             userStocks: stocks
//         });
//     })


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
    

function isAuthenticated(request, response, next) {
    if (request.session.passport !== undefined) {
        next();
    } else {
        response.redirect('/');
    }
}

module.exports = router;