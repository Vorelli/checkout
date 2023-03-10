const sequelize = require('../db.js');
const { Model, DataTypes } = require('sequelize');
const { INTEGER } = DataTypes;

class OrderItem extends Model {};

OrderItem.init({
  id: { type: INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  quantity: { type: INTEGER, allowNull: false }
  // ItemId
  // OrderId
}, {sequelize})

module.exports = OrderItem;