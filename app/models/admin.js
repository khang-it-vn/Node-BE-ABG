const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const Admin = sequelize.define('admin', {
  id_admin: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fullname: {
    type: Sequelize.STRING,
    allowNull: true
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
},{ tableName: 'admin' ,timestamps: false});

module.exports = Admin;
 