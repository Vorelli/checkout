USE checkout;
CREATE TABLE IF NOT EXISTS users (
  id int NOT NULL AUTO_INCREMENT,
  nameId int,
  email VARCHAR(255) NOT NULL,
  passHash VARCHAR(255) NOT NULL,
  billingId int,
  addressId int,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS addresses (
  userId int NOT NULL,
  id int NOT NULL AUTO_INCREMENT,
  line1 VARCHAR(255),
  line2 VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(2),
  zip VARCHAR(10),
  phoneNum VARCHAR(20),
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS billingAccounts (
  id int NOT NULL AUTO_INCREMENT,
  cardNum VARCHAR(24),
  expirationDate DATE,
  zip VARCHAR(10),
  userId int NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS shippingNames (
  userId int,
  id int NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);


ALTER TABLE users ADD CONSTRAINT fk_name FOREIGN KEY(nameId) REFERENCES shippingNames(id);
ALTER TABLE users ADD CONSTRAINT fk_billing FOREIGN KEY(billingId) REFERENCES billingAccounts(id);
ALTER TABLE users ADD CONSTRAINT fk_address FOREIGN KEY(addressId) REFERENCES addresses(id);
ALTER TABLE addresses ADD CONSTRAINT fk_addressToUser FOREIGN KEY(userId) REFERENCES users(id);
ALTER TABLE billingAccounts ADD CONSTRAINT fk_billingToUser FOREIGN KEY(userId) REFERENCES users(id);
ALTER TABLE shippingNames ADD CONSTRAINT fk_nameToUser FOREIGN KEY(userId) REFERENCES users(id);