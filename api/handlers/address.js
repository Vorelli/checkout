const router = require('express').Router();
const { createUser } = require('../db/models/User.js');
const { getUser } = require('../middleware/auth/index.js');

router.get('/', getUser, async (req, res) => {
  if(!req.user) { return res.json({ message: 'you need to sign in' }); }
  let addresses = await res.locals.sequelize.models.Address.findAll({
    where: { UserId: req.user.dataValues.id },
    attributes: ['line1', 'line2', 'city', 'name', 'state', 'zip', 'phoneNum', 'id']
  });
  addresses = addresses.map(address => {
    address.dataValues.isCurrent = req.user.dataValues.AddressId === address.dataValues.id;
    return address;
  })
  res.json({ addresses });
});

module.exports = router;