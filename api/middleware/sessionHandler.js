const { v4: uuidv4 } = require("uuid");
const { con, sequelize } = require('../db/index.js');

var handleSession = async (req, res, next) => {
  /**
   *
   * Parse cookies in incoming request:
   *
   */

  let cookieString = req.get("Cookie") || "";

  parsedCookies = cookieString.split("; ").reduce((cookies, cookie) => {
    if (cookie.length) {
      const cookieSplit = cookie.split('=');
      cookies[cookieSplit[0]] = cookieSplit[1];
    }
    return cookies;
  }, {});

  if (parsedCookies.s_id) {
    req.session = await sequelize.models.Session.findOne({ where: { hash: parsedCookies.s_id }});
    if(req.session === null) {
      req.session = await createSession();
      res.cookie("s_id", req.session.dataValues.hash);
    }
  } else {
    req.session = await createSession();
    res.cookie("s_id", req.session.dataValues.hash);
  }

  next();
};

var createSession = async (UserId) => {
  return await sequelize.models.Session.create({ hash: uuidv4(), UserId: UserId || null });
}

module.exports = { createSession, handleSession };