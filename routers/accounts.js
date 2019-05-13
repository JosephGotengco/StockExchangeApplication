const express = require('express');
// function for converting monetary values
var convert = require("../feature_functions/getRates");
// function for retrieving symbols for currency codes
const rate_symbols = require('../feature_functions/rate_symbols');

const router = new express.Router();


router
    .route("/trading-portfolio")
    .get(isAuthenticated, async(request, response) => {
        var ssn = request.session.passport.user;
        console.log(ssn);
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

        response.render("trading-portfolio.hbs", {
            title: message,
            head: cash2[0] * rate,
            display: "Portfolio",
            displayTransactions: displayTransactions,
            userStocks: stocks,
            currency_symbol: currency_symbol,
            currency_code: preference,
            firstname: firstname,
            lastname: lastname,
            username: username,
            date_joined: date_joined,
            userStatsData: ssn.userStatsData
        });
    })

router
    .route("/trading-portfolio-holdings")
    .post(isAuthenticated, (request, response) => {
        var ssn = request.session.passport.user;

        var stocks = ssn.stocks;
        var num_stocks = stocks.length;
        var message = "Shares: \n";
        var cash2 = ssn.cash2;
        var transactions = ssn.transactions;
        var num_transactions = transactions.length;

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
                    price: price,
                    balance: balance
                };

                displayTransactions.push(displayLog);
            }
        }
        response.render("trading-portfolio.hbs", {
            title: message,
            head: cash2[0],
            display: "Portfolio",
            displayTransactions: displayTransactions,
            userStocks: stocks
        });
    })



function isAuthenticated(request, response, next) {
    if (request.session.passport !== undefined) {
        next();
    } else {
        response.redirect('/');
    }
}

module.exports = router;