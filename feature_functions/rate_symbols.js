
var getCurrencySymbol = (currency_code) => {
    try {
        var symbols = {
            "USD": "$",
            "JPY": "¥‎",
            "BGN": "Лв.",
            "CZK": "Kč",
            "DKK": "Kr.",
            "GBP": "£",
            "HUF": "Ft",
            "PLN": "zł",
            "RON": "lei",
            "SEK": "kr",
            "CHF": "₣",
            "ISK": "Íkr",
            "NOK": "kr",
            "HRK": "kn",
            "RUB": "₽",
            "TRY": "₺",
            "AUD": "A$",
            "BRL": "R$",
            "CAD": "$",
            "CNY": "¥",
            "HKD": "HK$",
            "IDR": "Rp",
            "ILS": "₪",
            "INR": "₹",
            "KRW": "₩",
            "MXN": "Mex$",
            "MYR": "RM",
            "NZD": "$",
            "PHP": "₱",
            "SGD": "S$",
            "THB": "฿",
            "ZAR": "R",
        }
    var symbol = symbols[currency_code];
    if (symbol === undefined) {
        throw "symbol is not supported"
    } else {
        return symbol
    }
    } catch(e) {
        console.error(e);
    }
}


module.exports = {
    getCurrencySymbol
}