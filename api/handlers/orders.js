const router = require('express').Router();
const { createUser } = require('../db/models/User.js');
const { getUser } = require('../middleware/auth/index.js');

router.get('/', getUser, async (req, res) => {
  if(!req.user) { return res.json({ message: 'you need to sign in' }); }
  let orders = await res.locals.sequelize.models.Order.findAll({ where: { UserId: req.user.dataValues.id }});
  res.json({ orders });
});

router.get('/:id', getUser, async (req, res) => {
  console.log(req.params.id);
  if(!req.user) { return res.json({ message: 'you need to sign in' }); }
  let order = await res.locals.sequelize.models.Order.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: res.locals.sequelize.models.BillingAccount,
        where: res.locals.sequelize.literal('Order.BillingAccountId=BillingAccount.id'),
        required: true
      },
      {
        model: res.locals.sequelize.models.Address,
        where: res.locals.sequelize.literal('Order.AddressId=Address.id'),
        required: true
      }
    ]
  });
  console.log(order);
  order.dataValues.BillingAccount.dataValues.cardNum = order.dataValues.BillingAccount.dataValues.cardNum.slice(order.dataValues.BillingAccount.dataValues.cardNum.length - 4);
  let orderItems = await res.locals.sequelize.models.OrderItem.findAll({
    where: { OrderId: req.params.id },
    include: [
      {
        model: res.locals.sequelize.models.Item,
        where: res.locals.sequelize.literal('OrderItem.ItemId=Item.id'),
        required: true
      }
    ]
  });
  console.log(orderItems);
  if(order.dataValues.UserId !== req.user.dataValues.id) { return res.json({ message: 'you need to sign in' }); }
  res.json({ order, items: orderItems });
});

module.exports = router;