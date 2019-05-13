var axios = require('axios');

var getRates = async() => {
    try {
        const url = 'https://api.exchangeratesapi.io/latest?base=USD';
        var response = await axios.get(url);
        var data = response.data;
        var rates = data.rates;
        return rates
    } catch(e) {
        console.error(e);
    }
}



module.exports = getRates;
