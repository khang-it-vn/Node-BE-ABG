const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const Account = sequelize.define('account', {
  id_account: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  privateKey: {
    type: Sequelize.STRING,
    allowNull: false
  },
  publicKey: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mpass: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  }
},{ tableName: 'account' ,timestamps: false});

module.exports = Account;
