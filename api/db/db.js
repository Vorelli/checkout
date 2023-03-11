// const mysql = require("mysql2");
// Configure process.env variables in ../.env
/* const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
}); */
// const Promise = require("bluebird");
require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: true
});

// const db = Promise.promisifyAll(connection, { multiArgs: true });

/* db.connectAsync()
  .then(() => console.log(`Connected to MySQL as id: ${db.threadId}`))
  .then(() =>
    // Expand this table definition as needed:
    db.queryAsync(`
      ALTER TABLE users ADD CONSTRAINT fk_name FOREIGN KEY(nameId) REFERENCES shippingNames(id);
      ALTER TABLE users ADD CONSTRAINT fk_billing FOREIGN KEY(billingId) REFERENCES billingAccounts(id);
      ALTER TABLE users ADD CONSTRAINT fk_address FOREIGN KEY(addressId) REFERENCES addresses(id);
      ALTER TABLE addresses ADD CONSTRAINT fk_addressToUser FOREIGN KEY(userId) REFERENCES users(id);
      ALTER TABLE billingAccounts ADD CONSTRAINT fk_billingToUser FOREIGN KEY(userId) REFERENCES users(id);
      ALTER TABLE shippingNames ADD CONSTRAINT fk_nameToUser FOREIGN KEY(userId) REFERENCES users(id);`
    )
  )
  .catch((err) => console.log(err));

  db.create */

module.exports = sequelize;
