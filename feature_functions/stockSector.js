var axios = require('axios');

var getBatchClosePrice = async(sector) => {
    try {
        if (typeof sector != "string") {
            throw TypeError("wrong type")
        }
        var url = `https://ws-api.iextrading.com/1.0/stock/market/collection/sector?collectionName=${sector}`;
        var response_data = (await axios.get(url)).data.splice(0,50);
        console.log(response_data)
        return response_data

    } catch (e) {
        if (e instanceof TypeError && e.message === "wrong type") {
            console.log("hit1")
            return false
        } else if (e instanceof TypeError && e.message === "no response") {
            console.log("hit2")

            return false
        } else if (e.response === undefined) {
            console.log("hit3")
            return false
        } else {
            console.log(e);
        }
    }
}

getBatchClosePrice("Technology")

module.exports = {
    getBatchClosePrice
}