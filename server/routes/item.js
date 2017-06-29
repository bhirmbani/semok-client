const express = require('express');

const router = express.Router();
const Item = require('../controllers/item');

router.post('/', Item.create);
router.get('/', Item.gets);

module.exports = router;
