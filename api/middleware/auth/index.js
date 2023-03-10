const bcrypt = require('bcrypt');
// const { createSession } = require('../sessionHandler.js');
// const obj = require('../sessionHandler.js');
// console.log(obj);
const saltRounds = 10;

module.exports.hashPass = async (password) => {
  let hash = '';
  let salt = '';
  try {
    salt = await bcrypt.genSalt(saltRounds);
    hash = await bcrypt.hash(password, salt);
  } catch(err) {
    throw err;
  }

  return { hash, salt }
};

module.exports.compare = async(attemptedPass, currentPass) => {
  return await bcrypt.compare(attemptedPass, currentPass);
}

module.exports.getUser = async(req, res, next) => {
  req.user = await res.locals.sequelize.models.User.findOne({ where: { id: req.session.UserId } });
  if(!req.user) {
    return res.json({ err: 'No user' });
  }
  next();
}

// module.exports.createAndAttachNewSession = async function (req, res, UserId = null) {
//   req.session = await createSession(UserId);
//   res.cookie('s_id', req.session.dataValues.hash);
// };
