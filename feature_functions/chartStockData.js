var axios = require('axios');

var getStockData = async(stock) => {
    try {
        if (typeof stock != "string") {
            throw TypeError("wrong type")
        }
        var response_data = (await axios.get(`https://cloud.iexapis.com/stable/stock/market/batch?symbols=${stock}&types=chart&range=1y&token=pk_5187144627fe41f783caf3f0341d7f3e`)).data;
        if (Object.keys(response_data).length === 0 || Object.values(response_data).length === 0) {
            throw TypeError("no response");
        }

        var closeObj = {};
        var stock_data = response_data[stock.toUpperCase()]["chart"];
    
        stock_data.forEach((val, i) => {
            closeObj[val["date"]] = val["close"];
        })
        
        // console.log(closeObj);
        return closeObj


    } catch (e) {
        if (e instanceof TypeError && e.message === "wrong type") {
            return false
        } else if (e instanceof TypeError && e.message === "no response") {
            return false
        } else if (e.response === undefined) {
            return false
        } else {
            console.log(e);
        }
    }

}

module.exports = {
    getStockData
}