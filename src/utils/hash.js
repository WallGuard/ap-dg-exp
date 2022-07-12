const crypto = require('crypto');
// const config = require('../config');

const hash = (password) => {
  return crypto
    .createHmac('sha256', process.env.SECRET_KEY)
    .update(password.trim())
    .digest('hex');
};

module.exports = hash;
