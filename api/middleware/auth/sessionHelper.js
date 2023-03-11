const { createSession } = require('../sessionHandler.js');

module.exports.createAndAttachNewSession = async function (req, res, UserId = null) {
  req.session = await createSession(UserId);
  res.cookie('s_id', req.session.dataValues.hash);
};