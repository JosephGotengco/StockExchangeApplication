var axios = require('axios');

var getBatchClosePrice = async(stock) => {
    try {
        if (typeof stock != "string") {
            throw TypeError("wrong type")
        }
        var url = `https://cloud.iexapis.com/stable/stock/market/batch?symbols=${stock}&types=chart&range=1m&last=5&token=pk_5187144627fe41f783caf3f0341d7f3e`;
        var response_data = (await axios.get(url)).data;
        const keys = Object.keys(response_data);
        var close_prices = {};
		for (i = 0; i < keys.length; i++) {
            close_prices[keys[i]] = response_data[keys[i]].chart.splice(-1)[0].close;
        }
        return close_prices

    } catch (e) {
        if (e instanceof TypeError && e.message === "wrong type") {
            // console.log("hit1")
            return false
        } else if (e instanceof TypeError && e.message === "no response") {
            // console.log("hit2")
            return false
        } else if (e.response === undefined) {
            // console.log(e)
            // console.log("hit3")
            return false
        } else {
            console.log(e);
        }
    }
}




module.exports = {
    getBatchClosePrice
}
