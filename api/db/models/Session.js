const sequelize = require('../db.js');
const { Model, DataTypes } = require('sequelize');
const { INTEGER, STRING } = DataTypes;

class Session extends Model {};

Session.init({
  hash: { type: STRING, allowNull: false, primaryKey: true }
}, {sequelize})

module.exports = Session;