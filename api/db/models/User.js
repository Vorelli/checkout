const sequelize = require('../db.js');
const { Model, DataTypes } = require('sequelize');
const { hashPass } = require('../../middleware/auth/index.js');
const { INTEGER, STRING } = DataTypes;

class User extends Model {
  async addAddress({ name, line1, line2, city, state, zip, phoneNum }) {
    const address = await sequelize.models.Address.create({ name, line1, line2, city, state, zip, phoneNum, UserId: this.id, });
    this.AddressId = address.dataValues.id;
    await this.save();
    return address;
  }

  async addShippingName({ name }) {
    const shippingName = await sequelize.models.ShippingName.create({ name, UserId: this.id });
    this.ShippingNameId = shippingName.dataValues.id;
    await this.save();
    return shippingName;
  }

  async addBillingAccount({ cardNum, expirationDate, zip }) {
    const billingAccount = await sequelize.models.BillingAccount.create({ cardNum, expirationDate, zip, UserId: this.id, });
    this.BillingAccountId = billingAccount.dataValues.id;
    await this.save();
    return billingAccount;
  }
};

User.init({
  id: { type: INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  email: { type: STRING, allowNull: false, unique: 'email' },
  passHash: { type: STRING, allowNull: false },
  passSalt: { type: STRING, allowNull: false }
}, {sequelize})

module.exports = User;
module.exports.createUser = async ({ email, password }) => {
  try {
    const { hash, salt } = await hashPass(password);
    const user = await User.create({ email, passHash: hash, passSalt: salt });
    return user;
  } catch(err) {
    if(err) console.log('error creating user');
    throw err;
  }
};
