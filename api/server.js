require("dotenv").config();
const express = require("express");
const path = require("path");
const { handleSession } = require("./middleware/session-handler");
const logger = require("./middleware/logger");
const { sequelize } = require("./db/index.js");
const cors = require('cors');
const checkoutHandler = require('./handlers/checkout.js');
const userHandler = require('./handlers/user.js');

const allowlist = ['http://localhost:4444', undefined];
var corsOptions = function (req, callback) {
  var corsOps = { origin: allowlist.includes(req.header('Origin')) ? true : false };
  console.log(corsOps);
  // db.loadOrigins is an example call to load
  // a list of origins from a backing database
  callback(null, corsOps);
}

const app = express();
app.use((req, res, next) => {
  res.locals.sequelize = sequelize;
  next();
})

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
app.use('/api/user', userHandler);
app.use('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
})


/****
 *
 *
 * Other routes here....
 *
 *
 */
module.exports = app;