require("dotenv").config();
const express = require("express");
const path = require("path");
const { createAndAttachNewSession } = require("./middleware/auth/sessionHelper.js");
const { handleSession } = require("./middleware/sessionHandler");
const obj = require("./middleware/sessionHandler");
console.log(obj, 'in server.js');
const logger = require("./middleware/logger");
const { sequelize } = require("./db/index.js");
const cors = require('cors');
const checkoutHandler = require('./handlers/checkout.js');
const userHandler = require('./handlers/user.js');
const ordersHandler = require('./handlers/orders.js');
const addressHandler = require('./handlers/address.js');
const creditInformationHandler = require('./handlers/creditInformation.js');


const allowlist = ['http://localhost:4444', undefined];
var corsOptions = function (req, callback) {
  var corsOps = { origin: allowlist.includes(req.header('Origin')) ? true : false };
  console.log(corsOps);
  // db.loadOrigins is an example call to load
  // a list of origins from a backing database
  callback(null, corsOps);
}

console.log('right before importing db');
const app = express();
app.use((req, res, next) => {
  res.locals.sequelize = sequelize;
  next();
})
console.log('right after importing db');

app.use(cors(corsOptions));
// Adds `req.session_id` based on the incoming cookie value.
// Generates a new session if one does not exist.
app.use(handleSession);

// Logs the time, session_id, method, and url of incoming requests.
app.use(logger);

app.use(express.json());

// Serves up all static and generated assets in ../client/dist.
app.use(express.static(path.join(__dirname, "../public")));
app.use('/api/checkout', checkoutHandler);
app.use('/api/orders', ordersHandler);
app.use('/api/user', userHandler);
app.use('/api/addresses', addressHandler);
app.use('/api/creditInformation', creditInformationHandler);
app.get('/signout', async (req, res) => {
  await createAndAttachNewSession(req, res);
  res.redirect('/');
})
app.use('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});


/****
 *
 *
 * Other routes here....
 *
 *
 */
module.exports = app;