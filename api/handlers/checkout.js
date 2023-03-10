const router = require('express').Router();
const { createUser } = require('../db/models/User.js');
const { createSession } = require('../middleware/session-handler.js');
const { compare, getUser } = require('../middleware/auth/index.js');

router.get('/', (req, res) => {
  if(req.session.dataValues.UserId) {
    res.json({ message: 'logged in' })
  } else {
    res.json({message: 'we need to sign you up!'});
  }
});

router.post('/start', (req, res) => {
  if(req.session.dataValues.UserId !== null) {
    return res.json({ message: 'logged in' });
  } else {
    res.json({ message: 'create an account!' })
  }
})

async function createAndAttachNewSession(req, res, UserId) {
  req.session = await createSession(UserId);
  res.cookie('s_id', req.session.dataValues.hash);
}

router.post('/signIn', async (req, res) => {
  console.log('in signin');
  if(req.session.dataValues.UserId) {
    res.json({ message: 'logged in' })
  } else {
    console.log('else');
    try {
      const foundUser = await res.locals.sequelize.models.User.findOne({ where: { email: req.body.email } });
      console.log('foundUser', foundUser);
      if(!foundUser) return res.json({ err: 'Please try again.'});

      const isUser = await compare(req.body.password, foundUser.dataValues.passHash);
      console.log('isUser', isUser);
      if(isUser) {
        await createAndAttachNewSession(req, res, foundUser.dataValues.id);
        res.json({ message: 'Correct. Come on in!' })
      } else {
        res.json({ err: 'Please try again.' })
      }
    } catch(err) {
      res.json(err);
    }
  }
});

router.post('/signUp', async (req, res) => {
  const { email, password } = req.body;
  console.log('trying to sign up with this data', req.body);
  let user;
  try { user = await createUser({ email, password })}
  catch(err) { if(err) {
    return res.json({ message: 'user already exists' });
  }}
  await createAndAttachNewSession(req, res, user.dataValues.id);
  try {
    req.session.UserId = user.dataValues.id;
    await req.session.save();
    return res.json({ message: 'User created!' });
  } catch(err) {
    if(err) { return res.json({ message: 'Failed to save ses', err })}
  }
});

router.post('/shippingInfo', getUser, async (req, res) => {
  try {
    const address = await req.user.addAddress(req.body);
    return res.json({ message: 'Address added!' });
  } catch(err) {
    res.json(err);
  }
});

router.post('/creditInformation', getUser, async (req, res) => {
  try {
    const billingAccount = await req.user.addBillingAccount(req.body);
    return res.json({ message: 'Billing account added!' });
  } catch(err) {
    res.json(err);
  }
});

router.get('/summary', async (req, res) => {
  const user = await res.locals.sequelize.models.User.findOne({ where: { id: req.session.UserId }});
  if(user) {
    Promise.all([
      res.locals.sequelize.models.Address.findOne({ where: { id: user.dataValues.AddressId } }),
      res.locals.sequelize.models.BillingAccount.findOne({ where: { id: user.dataValues.BillingAccountId } })
    ]).then(([address, billingAccount]) => {
      res.json({
        shipping: address,
        billing: {
          cardNum: billingAccount.cardNum.slice(billingAccount.cardNum.length - 4),
          expirationDate: billingAccount.expirationDate,
          zip: billingAccount.zip
        }
      });
    }).catch(err => {
      console.log(err);
      res.json({ err })
    });
  } else {
    res.json({ err: 'Go back to start' });
  }
});

router.post('/submitOrder', getUser, async (req, res) => {
  try {
    const cvv = req.body.cvv;
    //process order...
    const billingAccount = await res.locals.sequelize.models.BillingAccount.findOne({ where: { UserId: req.user.dataValues.id } });
    console.log('billingAcc', !!billingAccount)
    const address = await res.locals.sequelize.models.Address.findOne({ where: { UserId: req.user.dataValues.id } });
    console.log('address', !!address)
    const order = await res.locals.sequelize.models.Order.create({
      UserId: req.user.dataValues.id,
      BillingAccountId: billingAccount.dataValues.id,
      AddressId: address.dataValues.id
    });
    console.log('order', !!order)
    const item = await res.locals.sequelize.models.Item.create({
      stock: 1,
      price: 100,
      name: 'Bag of Honey',
      description: 'A big bag of honey. Sack has 50L capacity, but it will probably be empty by the time it arrives.',
    });
    console.log('item', !!item)
    const orderItems = await res.locals.sequelize.models.OrderItem.create({ quantity: 1, OrderId: order.dataValues.id });
    return res.json({ message: 'Order submitted!' });
  } catch(err) {
    res.json(err);
  }
});

module.exports = router;