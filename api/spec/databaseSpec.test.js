require('dotenv').config();
const { con, sequelize } = require('../db/index.js');
jest.setTimeout(30000);

describe('database', function() {
  beforeAll(async () => {
    const conSuccess = await con;
  })

  beforeEach(async () => {
    const deletedUser = await sequelize.models.User.destroy({ where: { email: 'test@test.com' } });
    const deletedAddress = await sequelize.models.Address.destroy({ where: { line1: '213 Heggen Ave' } });
    console.log('deleted', deletedUser, deletedAddress);
  });

  test('should save a user and return it when I query the database', async () => {
    try {
      console.log('about to create user');
      const user = await sequelize.models.User.create({ email: 'test@test.com', passHash: 'lkdfjlkadsjflk', passSalt: 'dkflsjdlskajfljl' });
      const foundUser = await sequelize.models.User.findAll({ where: { email: 'test@test.com' }});
      expect(foundUser[0].dataValues.email).toBe('test@test.com');
    } catch(err) {
      throw err;
    }
  });

  test('should throw an error when trying to create the same user twice', async () => {
    try {
      const user = await sequelize.models.User.create({ email: 'test@test.com', passHash: 'lkdfjlkadsjflk', passSalt: 'dkflsjdlskajfljl' });
      const badUser = await sequelize.models.User.create({ email: 'test@test.com', passHash: 'lkdfjlkadsjflk', passSalt: 'dkflsjdlskajfljl' });
    } catch(err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  test('should save a user and then every other type of model and should be able to look them up', async () => {
    let user = await sequelize.models.User.create({ email: 'test@test.com', passHash: 'lkdfjlkadsjflk', passSalt: 'dkflsjdlskajfljl' });
    let address = await user.addAddress({
      line1: '213 Heggen Ave',
      line2: '',
      city: 'Egg Harbor Township',
      state: 'NJ',
      zip: '08234',
      phoneNum: '13863078855',
      UserId: user.dataValues.id,
    });
    let billingAccount = await user.addBillingAccount({ cardNum: '1111222233334444', expirationDate: new Date(), zip: '08234' });
    let shippingName = await user.addShippingName({ name: 'Natale Toscano' });

    let foundUser = await sequelize.models.User.findAll({ where: { id: user.dataValues.id } });
    expect(foundUser[0].dataValues.AddressId).toBe(address.dataValues.id);
    expect(foundUser[0].dataValues.BillingAccountId).toBe(billingAccount.dataValues.id);
    expect(foundUser[0].dataValues.ShippingNameId).toBe(shippingName.dataValues.id);

    await address.destroy();
    await billingAccount.destroy();
    foundUser = await sequelize.models.User.findAll({ where: { id: user.dataValues.id } });
    expect(foundUser[0].dataValues.AddressId).toBe(null);
    expect(foundUser[0].dataValues.BillingAccountId).toBe(null);
    expect(foundUser[0].dataValues.ShippingNameId).toBe(shippingName.dataValues.id);

    await shippingName.destroy();
    foundUser = (await sequelize.models.User.findAll({ where: { id: user.dataValues.id } }))[0];
    expect(foundUser.dataValues.ShippingNameId).toBe(null);
    shippingName = await foundUser.addShippingName({ name: 'Natale Toscano' });
    let shippingName2 = await foundUser.addShippingName({ name: 'Joseph Toscano' });
    expect(foundUser.dataValues.ShippingNameId).toBe(shippingName2.id);
    await shippingName.destroy();
    expect(foundUser.dataValues.ShippingNameId).toBe(shippingName2.id);
  });
});