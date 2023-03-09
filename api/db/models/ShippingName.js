const sequelize = require('../db.js');
const { Model, DataTypes } = require('sequelize');
const { INTEGER, STRING } = DataTypes;

class ShippingName extends Model {
  async destroy() {
    const user = await sequelize.models.User.findOne({ where: { id: this.UserId }});
    if(user.dataValues.ShippingNameId === this.id) {
      user.dataValues.ShippingNameId = null;
      await user.save();
    }
    await super.destroy();
  };
};

ShippingName.init({
  id: { type: INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  name: { type: STRING, allowNull: false }
}, {sequelize})

module.exports = ShippingName;