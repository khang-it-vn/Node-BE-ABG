const { Sequelize } = require('sequelize');
const sequenlize = require('../database/database');

const Doc = sequenlize.define('doc',{
    id_doc: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    description:{
        type: Sequelize.STRING,
        allowNull: true,
    }
}, {tableName: 'doc', timestamps: false})

module.exports = Doc;