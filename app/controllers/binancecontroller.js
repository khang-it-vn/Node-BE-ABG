const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
var verifyToken = require("../util/verifyToken");
var checkmpass = require("../util/checkmpass");
const axios = require("axios");
let { getBinanceCoinPrice } = require("./api/binanceapi");
let CoinService = require("../services/coindService");

//  Add data cho bảng coin, sanh sách coin lấy từ sàn binance
router.get("/getPrices", async (req, res) => {
  axios
    .get("https://api.binance.com/api/v3/ticker/price")
    .then((response) => {
      const prices = response.data;
      console.log(prices);
      for (let i = 0; i < prices.length; i++) {
        var coin = {
          fullname: prices[i].symbol,
          image: "",
          symbol: prices[i].symbol,
        };
        CoinService.createCoin(coin);
      }
      res.status(200).json(prices);
    })
    .catch((error) => {
      console.log(error);
    });
});

// Lấy giá trị hiện tại của một loại coin
router.get("/getDataOfCoin/:symbol", verifyToken, async (req, res) => {
  const symbol = req.params.symbol;
  const apiUrl = `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`;
  axios
    .get(apiUrl)
    .then((response) => {
      const data = response.data;
      console.log(`The 24-hour ticker information for ${symbol} is:`, data);
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error(error);
    });
});
router.get("/getPriceFollowPage/:page", verifyToken, async (req, res) => {
  try {
    let page = req.params.page;
    let coins = await CoinService.getCoinList(page);
    let result = [];
    let apiUrlPrefix = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
    console.log(coins.length);

    for (let i = 0; i < coins.length; i++) {
      const apiUrl = apiUrlPrefix + coins[i].symbol;
      const response = await axios.get(apiUrl);
      const data = response.data;
      console.log(
        `The 24-hour ticker information for ${coins[i].symbol} is:`,
        data
      );
      result.push(data);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(404).send("Internal server error");
  }
});


module.exports = router;
