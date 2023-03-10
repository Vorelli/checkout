const sequelize = require('../db.js');
const { Model, DataTypes } = require('sequelize');
const { INTEGER, STRING, BOOLEAN } = DataTypes;

class Order extends Model {};

Order.init({
  id: { type: INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  trackingNum: { type: STRING, default: null },
  processed: { type: BOOLEAN, default: false, allowNull: false },
  preparing: { type: BOOLEAN, default: false, allowNull: false },
  // UserId
  // BillingId
  // AddressId
}, {sequelize})

module.exports = Order;