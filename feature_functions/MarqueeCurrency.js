    var moment = require("moment");
    var axios = require("axios");
    var getMarqueeCurrency = async() => {
        var yesterday = moment().subtract(2, 'days');
        var date = yesterday.format('YYYY-MM-DD');
        var rate = await axios.get('https://api.exchangeratesapi.io/latest?base=USD');
        var yest_rate = await axios.get(`https://api.exchangeratesapi.io/${date}?base=USD`);
        var json = rate.data.rates;
        var yest_json = yest_rate.data.rates;

        var cad = json.CAD;
        var bgn = json.BGN;
        var eur = json.EUR;
        var jpy = json.JPY;
        var aud = json.AUD;
        var hkd = json.HKD;
        var gbp = json.GBP;
        var mxn = json.MXN;
        var inr = json.INR;
        var cny = json.CNY;

        var yest_cad = yest_json.CAD;
        var yest_bgn = yest_json.BGN;
        var yest_eur = yest_json.EUR;
        var yest_jpy = yest_json.JPY;
        var yest_aud = yest_json.AUD;
        var yest_hkd = yest_json.HKD;
        var yest_gbp = yest_json.GBP;
        var yest_mxn = yest_json.MXN;
        var yest_inr = yest_json.INR;
        var yest_cny = yest_json.CNY;

        array1 = [cad, bgn, eur, jpy, aud, hkd, gbp, mxn, inr, cny];
        array2 = [yest_cad, yest_bgn, yest_eur, yest_jpy, yest_aud, yest_hkd, yest_gbp, yest_mxn, yest_inr, yest_cny];

        // console.log(parseFloat(array1[0]) >= parseFloat(array2[0]))
        // console.log(parseFloat(array1[1]) >= parseFloat(array2[1]))
        // console.log(parseFloat(array1[2]) >= parseFloat(array2[2]))
        // console.log(parseFloat(array1[3]) >= parseFloat(array2[3]))
        // console.log(parseFloat(array1[4]) >= parseFloat(array2[4]))
        // console.log(parseFloat(array1[5]) >= parseFloat(array2[5]))
        // console.log(parseFloat(array1[6]) >= parseFloat(array2[6]))
        // console.log(parseFloat(array1[7]) >= parseFloat(array2[7]))
        // console.log(parseFloat(array1[8]) >= parseFloat(array2[8]))
        // console.log(parseFloat(array1[9]) >= parseFloat(array2[9]))

        if(parseFloat(array1[0]) >= parseFloat(array2[0])){
            img0 ="../images/greentriangle.png";
        }else{
            img0 ="../images/redtriangle.png";
        };
        if(parseFloat(array1[1]) >= parseFloat(array2[1])){
            img1 ="../images/greentriangle.png";
        }else{
            img1 ="../images/redtriangle.png";
        };
        if(parseFloat(array1[2]) >= parseFloat(array2[2])){
            img2 ="../images/greentriangle.png";
        }else{
            img2 ="../images/redtriangle.png";
        };
        if(parseFloat(array1[3]) >= parseFloat(array2[3])){
            img3 ="../images/greentriangle.png";
        }else{
            img3 ="../images/redtriangle.png";
        };
        if(parseFloat(array1[4]) >= parseFloat(array2[4])){
            img4 ="../images/greentriangle.png";
        }else{
            img4 ="../images/redtriangle.png";
        };
        if(parseFloat(array1[5]) >= parseFloat(array2[5])){
            img5 ="../images/greentriangle.png";
        }else{
            img5 ="../images/redtriangle.png";
        };
        if(parseFloat(array1[6]) >= parseFloat(array2[6])){
            img6 ="../images/greentriangle.png";
        }else{
            img6 ="../images/redtriangle.png";
        };
        if(parseFloat(array1[7]) >= parseFloat(array2[7])){
            img7 ="../images/greentriangle.png";
        }else{
            img7 ="../images/redtriangle.png";
        };
        if(parseFloat(array1[8]) >= parseFloat(array2[8])){
            img8 ="../images/greentriangle.png";
        }else{
            img8 ="../images/redtriangle.png";
        };
        if(parseFloat(array1[9]) >= parseFloat(array2[9])){
            img9 ="../images/greentriangle.png";
        }else{
            img9 ="../images/redtriangle.png";
        };


        var currencyDataList = [
            {
                code: "CAD",
                price: cad.toFixed(2),
                img: img0
            },
            {
                code: "BGN",
                price: bgn.toFixed(2),
                img: img1 
            },
            {
                code: "EUR",				
                price: eur.toFixed(2),
                img: img2 
            },
            {
                code: "JPY",
                price: jpy.toFixed(2),
                img: img3 
            },
            {
                code: "AUD",
                price: aud.toFixed(2),
                img: img4 
            },
            {
                code: "HKD",
                price: hkd.toFixed(2),
                img: img5 
            },
            {
                code: "GBP",
                price: gbp.toFixed(2),
                img: img6 
            },
            {
                code: "MXN",
                price: mxn.toFixed(2),
                img: img7 
            },
            {
                code: "INR",
                price: inr.toFixed(2),
                img: img8 
            },
            {
                code: "CNY",
                price: cny.toFixed(2),
                img: img9 
            }
        ]
        
        return currencyDataList
    }

    module.exports = {
        getMarqueeCurrency
    }