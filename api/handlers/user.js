const router = require('express').Router();
const { createUser } = require('../db/models/User.js');
const { getUser } = require('../middleware/auth/index.js');

router.get('/', async (req, res) => {
  if(!req.session.dataValues.UserId) {
    return res.json({ message: 'you need to sign in' });
  }
  let user = await res.locals.sequelize.models.User.findOne({ where: { id: req.session.dataValues.UserId } });
  res.json({ email: user.email })
});

router.post('/address', getUser, async (req, res) => {
  try {
    await req.user.changeAddress({ AddressId: req.body.id });
    res.json({ message: 'You\'re good.' });
  } catch(err) {
    res.json({ err });
  }
});

router.post('/billing', getUser, async (req, res) => {
  try {
    await req.user.changeBilling({ BillingAccountId: req.body.id });
    res.json({ message: 'You\'re good.' });
  } catch(err) {
    res.json({ err });
  }
});

module.exports = router;