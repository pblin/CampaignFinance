const fetch = require("node-fetch");


module.exports = async function () {
    let url = "https://ethgasstation.info/json/ethgasAPI.json";
    let gasPrice = await fetch(url).then(r => r.json()).then(d => d.safeLow*100000000);
    return gasPrice;
}
