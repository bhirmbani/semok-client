const jwt = require('jsonwebtoken');

const methods = {};

methods.decode = token => jwt.decode(token);

export default methods;
