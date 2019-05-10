const express = require('express');
var ssn;

const router = new express.Router();

router
    .route("/news-hub")
    .get(isAuthenticated, async (request, response) => {
        // called when user goes to the news hub page
        if (ssn.stockDataList === undefined) {
            var stockDataList = await marqueeStock.getMarqueeStock();
            ssn.stockDataList = stockDataList;
        }

        response.render("news-hub.hbs", {
            title: "Stock and Currency.",
            currencyDataList: ssn.currencyDataList,
            stockDataList: ssn.stockDataList
        });
    })

router
    .route("/news/currency/:id")
    .get(isAuthenticated, async (request, response) => {
        // called when user clicks on currency text in marquee element
        // or in news hub page
        try {
            var currency_code = request.params.id;
            var chart_data = await currFunc.getCurrData(currency_code);
            var labels = Object.keys(chart_data);
            var data = Object.values(chart_data);

            response.render("currency-info.hbs", {
                title: "Welcome to the trading page.",
                chart_title: `${currency_code} Price`,
                labels: labels,
                data: data,
                display: `${currency_code} Price`
            });
        } catch (e) {
            console.error(e);
        }
    })

router
    .route("/news/stock/:id")
    .get(isAuthenticated, async (request, response) => {
        // called when user clicks on stock text in marquee element
        // or in news hub page
        try {
            var ticker = request.params.id;
            var chart_data = await stockFunc.getStockData(ticker);
            var labels = Object.keys(chart_data);
            var data = Object.values(chart_data);

            response.render("stock-info.hbs", {
                title: "Welcome to the trading page.",
                chart_title: `${ticker} Price`,
                labels: labels,
                data: data,
                display: `${ticker} Price`
            });
        } catch (e) {
            console.error(e);
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