var axios = require("axios");
var moment = require("moment");

var getCurrData = async(curr) => {
    try {
        if (typeof curr != "string") {
            throw TypeError("wrong type")
        }
        var curr = curr.toUpperCase();
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = moment().subtract(30, 'days');
        var formatted_firstDay = formatDate(firstDay);
        var formatted_lastDay = formatDate(lastDay);
        // console.log(formatted_firstDay);
        // console.log(formatted_lastDay);
        var response = await axios.get(`https://api.exchangeratesapi.io/history?start_at=${formatted_lastDay}&end_at=${formatted_firstDay}&symbols=${curr}&base=USD`);
        // console.log(response)
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
            return (parseInt(Object.keys(a)[0].slice(-2)) - parseInt(Object.keys(b)[0].slice(-2)));
        });
    
        // console.log(chart_data)
    
        var result = {};
        for (var i=0;i<chart_data.length;i++) {
            result[Object.keys(chart_data[i])[0]] = Object.values(chart_data[i])[0];
        }
        return result
    } catch(e) {
        if (e instanceof TypeError || e.message === "wrong type") {
            return false
        }
        // console.log(e.response.data);
        // console.log(e.response.status);
        // console.log(`Symbols \'${curr}'\ are invalid.`)
        // console.log(e.response.data["error"])
        if (e.response === undefined) {
            return false
        } if (e.response.data["error"] === `Symbols \'${curr}'\ are invalid.` || e.response.status === 400) {
            return false
        } else {
            console.error(e);
        }
    }
}




function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

// getCurrData(1)


module.exports = {
    getCurrData
};
