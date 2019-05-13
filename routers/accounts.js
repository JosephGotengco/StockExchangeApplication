const express = require('express');

const router = new express.Router();


router
    .route("/trading-portfolio")
    .get(isAuthenticated, (request, response) => {
        var stocks = request.session.passport.user.stocks;
        var num_stocks = stocks.length;
        var stock_keys = [];
        var cash = request.session.passport.user.cash;
        var message = "Shares: \n";
        var cash2 = request.session.passport.user.cash2;
        var transactions = request.session.passport.user.transactions;
        var num_transactions = transactions.length;
    
        if (num_stocks === 0) {
            message = "You currently do not have any stocks.";
        } else {
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
            title: `Welcome to your portfolio`,
            display: "Portfolio",
            displayTransactions: displayTransactions,
            userCash: cash2[0],
            userStocks: stocks
        });
    })

router
    .route("/trading-portfolio-holdings")
    .post(isAuthenticated, (request, response) => {
        var stocks = request.session.passport.user.stocks;
        var num_stocks = stocks.length;
        var stock_keys = [];
        var cash = request.session.passport.user.cash;
        var message = "Shares: \n";
        var cash2 = request.session.passport.user.cash2;
        var transactions = request.session.passport.user.transactions;
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