const router = require('express').Router();
const { createUser } = require('../db/models/User.js');
const { createSession } = require('../middleware/session-handler.js');

router.get('/', async (req, res) => {
  if(!req.session.dataValues.UserId) {
    return res.json({ message: 'you need to sign in' });
  }
  let user = await res.locals.sequelize.models.User.findOne({ where: { id: req.session.dataValues.UserId } });
  res.json({ email: user.email })
});

module.exports = router;