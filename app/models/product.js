const { Sequelize,DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Product = sequelize.define('product', {
    id_product: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.FLOAT
    },
    id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id'
      }
    }
},{tableName: 'product',timestamps: false});
module.exports = Product;


