var axios = require('axios');

var stockByDate = async(stocks, date) => {
    try {
    var stocks = stocks.replace(" ","");
    if (stocks === "") {
        return []
    }
    var date = date.replace(" ","");
    if (date === "") {
        return []
    }
    var date = date.toString();
    if (typeof date === "string") {
        if (date.split(".").length > 1) {
            return "date cannot be a float"
        }
    } 
    if (Number.isInteger(parseInt(date)) == false) {
        return "date must be a number"
    }
    if (date.length != 8 && date.length != 6) {
        return "date must be in the format of yyyymmdd or yymmdd"
    }
    if (! /^\d+$/.test(date)) {
        return "date must be a number"
    }
    
    // Stocks must be a string
    // Date must be in the yyyymmdd format
    var url = `https://cloud.iexapis.com/stable/tops?token=sk_291eaf03571b4f0489b0198ac1af487d&symbols=${stocks},/${date}`;
    var stock_data = (await axios.get(url)).data;


    // Error Checking
    var user_ticker_list = stocks.split(",");
    var api_ticker_list = [];
    stock_data.forEach((val, i) => {
        api_ticker_list.push(val.symbol);
    });

    // Error Checking => Check response for each user ticker
    user_ticker_list.forEach((user_val, i) => {
    // Desc: Loop through all the tickers that user gave and check if they are given back by API
    //       Cannot check status because it always returns 200 and an empty list
        var counter = 0
        api_ticker_list.forEach((val, i) => {
            if (user_val == val) {
                counter += 1
            }
        });
        if (counter != 1) {
            index = user_ticker_list.indexOf(user_val);
            if (index === user_ticker_list.length - 1){
                var index = user_ticker_list.indexOf(user_val);
                stock_data.splice(index, 0, "invalid ticker");
            } else {
                var index = user_ticker_list.indexOf(user_val);
                stock_data.splice(index, 0, "invalid ticker");
            }
        }
    });
    
    return stock_data

    } catch(e) {
        console.error(e);
    }
}

module.exports = stockByDate;

// // var main = async() => {
// //     var result = await stockByDate("", 20000411);
// //     console.log(result)
// // }

// // main()

// export default function sum(a, b) {
//     return a + b;
//   }

// export default stockByDate;