var axios = require("axios");

var getMarqueeStock = async() => {
    var stock_info = await axios.get('https://ws-api.iextrading.com/1.0/stock/market/batch?symbols=NFLX,AAPL,TSLA,GOOG,SBUX,FB,BA,BABA,NKE,AMZN&types=chart&range=1m');
    var json = stock_info.data;

    nflx_info = json['NFLX'].chart.slice(-1)[0].close,
    aapl_info = json['AAPL'].chart.slice(-1)[0].close,
    tsla_info = json['TSLA'].chart.slice(-1)[0].close,
    goog_info = json['GOOG'].chart.slice(-1)[0].close,
    sbux_info = json['SBUX'].chart.slice(-1)[0].close,
    fb_info = json['FB'].chart.slice(-1)[0].close,
    ba_info = json['BA'].chart.slice(-1)[0].close,
    baba_info = json['BABA'].chart.slice(-1)[0].close,
    nke_info = json['NKE'].chart.slice(-1)[0].close,
    amzn_info = json['AMZN'].chart.slice(-1)[0].close, 
    yest_nflx_info = json['NFLX'].chart.slice(-2)[0].close,
    yest_aapl_info = json['AAPL'].chart.slice(-2)[0].close,
    yest_tsla_info = json["TSLA"].chart.slice(-2)[0].close,
    yest_goog_info = json['GOOG'].chart.slice(-2)[0].close,
    yest_sbux_info = json['SBUX'].chart.slice(-2)[0].close,
    yest_fb_info = json['FB'].chart.slice(-2)[0].close,
    yest_ba_info = json['BA'].chart.slice(-2)[0].close,
    yest_baba_info = json['BABA'].chart.slice(-2)[0].close,
    yest_nke_info = json['NKE'].chart.slice(-2)[0].close,
    yest_amzn_info = json['AMZN'].chart.slice(-2)[0].close


    array1 = [nflx_info, aapl_info, tsla_info, goog_info, sbux_info, fb_info, ba_info, baba_info, nke_info, amzn_info];
    array2 = [yest_nflx_info, yest_aapl_info, yest_tsla_info, yest_goog_info, yest_sbux_info, yest_fb_info, yest_ba_info, yest_baba_info, yest_nke_info, yest_amzn_info];


    console.log(parseFloat(array1[0]) >= parseFloat(array2[0]))
    console.log(parseFloat(array1[1]) >= parseFloat(array2[1]))
    console.log(parseFloat(array1[2]) >= parseFloat(array2[2]))
    console.log(parseFloat(array1[3]) >= parseFloat(array2[3]))
    console.log(parseFloat(array1[4]) >= parseFloat(array2[4]))
    console.log(parseFloat(array1[5]) >= parseFloat(array2[5]))
    console.log(parseFloat(array1[6]) >= parseFloat(array2[6]))
    console.log(parseFloat(array1[7]) >= parseFloat(array2[7]))
    console.log(parseFloat(array1[8]) >= parseFloat(array2[8]))
    console.log(parseFloat(array1[9]) >= parseFloat(array2[9]))
    


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


    var stockDataList = [
        {
            code: "NFLX",
            price: json['NFLX'].chart.slice(-1)[0].close,
            img: img0
        },
        {
            code: "AAPL",
            price: json['AAPL'].chart.slice(-1)[0].close,
            img: img1 
        },
        {
            code: "TSLA",				
            price: json['TSLA'].chart.slice(-1)[0].close,
            img: img2 
        },
        {
            code: "GOOG",
            price: json['GOOG'].chart.slice(-1)[0].close,
            img: img3 
        },
        {
            code: "SBUX",
            price: json['SBUX'].chart.slice(-1)[0].close,
            img: img4 
        },
        {
            code: "FB",
            price: json['FB'].chart.slice(-1)[0].close,
            img: img5 
        },
        {
            code: "BA",
            price: json['BA'].chart.slice(-1)[0].close,
            img: img6 
        },
        {
            code: "BABA",
            price: json['BABA'].chart.slice(-1)[0].close,
            img: img7 
        },
        {
            code: "NKE",
            price: json['NKE'].chart.slice(-1)[0].close,
            img: img8 
        },
        {
            code: "AMZN",
            price: json['AMZN'].chart.slice(-1)[0].close,
            img: img9 
        }
    ]

    return stockDataList
}

module.exports = {
    getMarqueeStock
}