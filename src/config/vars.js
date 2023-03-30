const path = require('path');
const moment = require("moment");

// import .env variables
require('dotenv').config();

module.exports = {
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  encryptionKey: process.env.ENCRYPTION_KEY,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  frontEncSecret: process.env.FRONT_ENC_SECRET,
  emailAdd: process.env.EMAIL,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  mailgunApi:process.env.MAILGUN_API,
  pwEncryptionKey: process.env.PW_ENCRYPTION_KEY,
  pwdSaltRounds: process.env.PWD_SALT_ROUNDS,
  baseUrl: process.env.BASE_URL,
  frontenUrl: process.env.REACT_APP_FRONT_URL,
  adminPasswordKey: process.env.ADMIN_PASSWORD_KEY,
  xAuthToken : process.env.XAUTHTOKEN,
  authorization : process.env.AUTHORIZATION  
};
