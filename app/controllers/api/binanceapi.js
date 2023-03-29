const axios = require('axios');

const getBinanceCoinPrice = async (coin) => {
  try {
    console.log(`Making request to Binance API with coin symbol: ${coin}`);
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${coin}`);
    console.log(`Received response from Binance API with status code: ${response.status}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getBinanceCoinPrice };
