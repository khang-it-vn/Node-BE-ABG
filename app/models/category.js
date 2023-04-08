const Sequelize = require('sequelize');
const sequelize = require("../database/database");

const Category = sequelize.define("category",{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true
    }
},{tableName: "category", timestamps: false});

module.exports = Category;