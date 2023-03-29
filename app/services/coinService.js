const Coin = require("../models/coin");

class CoinService {
  static async createCoin(coinData) {
    try {
      const coin = await Coin.create(coinData);
      return coin.toJSON();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateCoin(coin_id, coinData) {
    try {
      const coin = await Coin.findByPk(coin_id);
      if (!coin) {
        throw new Error("Coin not found");
      }
      const updatedCoin = await coin.update(coinData);
      return updatedCoin.toJSON();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteCoin(coin_id) {
    try {
      const coin = await Coin.findByPk(coin_id);
      if (!coin) {
        throw new Error("Coin not found");
      }
      await coin.destroy();
      return { message: "Coin deleted" };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //   Lấy danh coin theo page
  static async getCoinList(page) {
    const limit = 20;
    const offset = (page - 1) * limit;
    try {
      const coins = await Coin.findAll({ limit, offset });
      return coins.map((coin) => coin.toJSON());
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //  Lấy tổng số đồng coin hiện có trong bảng
  static async getCoinRowCount() {
    try {
      const count = await Coin.count();
      return count;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = CoinService;
