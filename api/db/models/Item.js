const sequelize = require('../db.js');
const { Model, DataTypes } = require('sequelize');
const { INTEGER, FLOAT, TEXT, STRING } = DataTypes;

class Item extends Model {};

Item.init({
  id: { type: INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  stock: { type: INTEGER, allowNull: false },
  price: { type: FLOAT, allowNull: false },
  name: { type: STRING, allowNull: false },
  description: { type: TEXT, allowNull: false }
}, {sequelize})

module.exports = Item;