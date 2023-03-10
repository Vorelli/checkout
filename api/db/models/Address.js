const sequelize = require('../db.js');
const { Model, DataTypes } = require('sequelize');
const { INTEGER, STRING } = DataTypes;

class Address extends Model {
  async destroy() {
    const user = await sequelize.models.User.findOne({ where: { id: this.UserId }});
    if(user.dataValues.AddressId === this.id) {
      user.dataValues.AddressId = null;
      const a = await user.save();
    }
    await super.destroy();
  };
};

Address.init({
  id: { type: INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  name: { type: STRING, allowNull: false },
  line1: { type: STRING, allowNull: false },
  line2: { type: STRING, allowNull: false },
  city: { type: STRING, allowNull: false },
  state: { type: STRING(2), allowNull: false },
  zip: { type: STRING(10), allowNull: false },
  phoneNum: { type: STRING(20), allowNull: false },
}, {sequelize})

module.exports = Address;