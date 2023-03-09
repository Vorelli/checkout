const User = require('./models/User.js');
const Address = require('./models/Address.js');
const BillingAccount = require('./models/BillingAccount.js');
const ShippingName = require('./models/ShippingName.js');
const Session = require('./models/Session.js');
const sequelize = require('./db.js');

User.hasMany(Address);  // this gives a UserId to Address
User.hasMany(BillingAccount); // this gives a UserId to BillingAccount
User.hasMany(ShippingName); // this gives a UserId to ShippingName
User.hasOne(Session); // this gives a UserId to Session
Address.belongsTo(User, { foreignKeyConstraint: true });
BillingAccount.belongsTo(User, { foreignKeyConstraint: true });
ShippingName.belongsTo(User, { foreignKeyConstraint: true });
Session.belongsTo(User, { foreignKeyConstraint: true });

Address.hasOne(User);
BillingAccount.hasOne(User);
ShippingName.hasOne(User);
User.belongsTo(Address, { foreignKeyConstraint: true });
User.belongsTo(BillingAccount, { foreignKeyConstraint: true });
User.belongsTo(ShippingName, { foreignKeyConstraint: true });

const con = sequelize.sync()
  .then(() => console.log('Database synced!'))
  .catch(err => console.log('Database err:', err));
module.exports = { con, sequelize };