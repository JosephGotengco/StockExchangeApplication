var axios = require("axios");
var moment = require("moment");
var formatDate = require("./formatDate");

var getCurrData = async(curr) => {
    try {
        if (typeof curr != "string") {
            throw TypeError("wrong type")
        }

        var curr = curr.toUpperCase();
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDay());
        var lastDay = moment().subtract(365, 'days');    
        var formatted_firstDay = formatDate.formatDate(firstDay);
        var formatted_lastDay = formatDate.formatDate(lastDay);
        var response = await axios.get(`https://api.exchangeratesapi.io/history?start_at=${formatted_lastDay}&end_at=${formatted_firstDay}&symbols=${curr}&base=USD`);
        var response_data = response.data.rates
        // console.log(response_data)
        var labels = Object.keys(response_data)
        // console.log(labels)
        var dataObjs = Object.values(response_data);
        var data = [];
        dataObjs.forEach((val, i) => {
            data.push(val[curr])
        })
        // console.log(data);
        var chart_data = [];
        labels.forEach((val, i) => {
            var new_obj = {}
            new_obj[val] = data[i];
            chart_data.push(new_obj);
        })

        chart_data.sort(function (a, b) {
            return (new Date(Object.keys(a)[0]) - new Date(Object.keys(b)[0]));
        });


        var result = {};
        for (var i=0;i<chart_data.length;i++) {
            result[Object.keys(chart_data[i])[0]] = Object.values(chart_data[i])[0];
        }
        return result
    } catch(e) {
        if (e instanceof TypeError && e.message === "wrong type") {
            // console.log("getCurrData was given a non-string type as the argument");
            return false
        }
        if (e.response === undefined) {
            // console.log("getCurrData did not get a respones from the exchangeratesapi");
            return false
        } if (e.response.data["error"] === `Symbols \'${curr}'\ are invalid.` && e.response.status === 400) {
            // console.log("getCurrData arguments were not valid symbols for exchangeratesapi");
            return false
        } else {
            // console.log("hit 4")
            console.error(e);
        }
    }
}




module.exports = {
    getCurrData
};
