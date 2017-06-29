const express = require('express');

const router = express.Router();
const Item = require('../controllers/item');

router.post('/', Item.create);

module.exports = router;
