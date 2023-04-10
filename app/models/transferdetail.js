const sequelize = require('../database/database');
const {Sequelize, DataTypes} = require('sequelize');


// Define the TransferDetail model
const TransferDetail = sequelize.define('TransferDetail', {
    txh: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    id_account_sender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'id_account'
      }
    },
    id_account_receiver: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'id_account'
      }
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    tip: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    time_create: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    tableName: 'transferdetail',
    timestamps: false
  });
  
  // Export the TransferDetail model
  module.exports = TransferDetail;