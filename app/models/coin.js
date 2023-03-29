const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const Coin = sequelize.define('coin', {
  id_coin: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullname: {
    type: Sequelize.STRING,
    allowNull: true
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  },
  symbol: {
    type: Sequelize.STRING,
    allowNull: true
  }
},{ tableName: 'coin' ,timestamps: false});

module.exports = Coin;
