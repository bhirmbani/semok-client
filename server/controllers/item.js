const models = require('../models');

const methods = {};

methods.create = (req, res, next) => {
  if (!req.headers.token) {
    res.json({ msg: 'butuh jwt token untuk membuat todo', ok: false });
  }
};

module.exports = methods;
