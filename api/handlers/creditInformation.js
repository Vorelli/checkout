const router = require('express').Router();
const { createUser } = require('../db/models/User.js');
const { getUser } = require('../middleware/auth/index.js');

router.get('/', getUser, async (req, res) => {
  if(!req.user) { return res.json({ message: 'you need to sign in' }); }
  let billingAccounts = await res.locals.sequelize.models.BillingAccount.findAll({
    where: { UserId: req.user.dataValues.id },
    attributes: ['cardNum', 'expirationDate', 'zip', 'id']
  });
  billingAccounts = billingAccounts.map(account => {
    account.dataValues.cardNum = account.dataValues.cardNum.slice(account.dataValues.cardNum.length - 4);
    account.dataValues.isCurrent = req.user.dataValues.BillingAccountId === account.dataValues.id;
    return account;
  })
  res.json({ billingAccounts });
});

module.exports = router;