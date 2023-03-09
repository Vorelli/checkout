const sequelize = require('../db.js');
const { Model, DataTypes } = require('sequelize');
const { INTEGER, STRING, DATEONLY } = DataTypes;

class BillingAccount extends Model {
  async destroy() {
    const user = await sequelize.models.User.findOne({ where: { id: this.UserId }});
    if(user.dataValues.BillingAccountId === this.id) {
      user.dataValues.BillingAccountId = null;
      await user.save();
    }
    await super.destroy();
  };
};

BillingAccount.init({
  id: { type: INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  cardNum: { type: STRING(24), allowNull: false },
  expirationDate: { type: DATEONLY, allowNull: false },
  zip: { type: STRING(10), allowNull: false }
}, {sequelize})

module.exports = BillingAccount;
