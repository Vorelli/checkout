const router = require('express').Router();
const { createUser } = require('../db/models/User.js');
const { createSession } = require('../middleware/session-handler.js');
const { getUser } = require('../middleware/auth/index.js');

router.get('/', getUser, async (req, res) => {
  if(!req.user) { return res.json({ message: 'you need to sign in' }); }
  let orders = await res.locals.sequelize.models.Order.findAll({ where: { UserId: req.user.dataValues.id }});
  res.json({ orders });
});

module.exports = router;