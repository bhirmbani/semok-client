const express = require('express');

const router = express.Router();
const Item = require('../controllers/item');

router.post('/', Item.create);
router.post('/delegate', Item.delegateItem);
router.post('/description', Item.description);
router.get('/', Item.gets);
router.get('/category/:categoryId', Item.getItemByCategoryName);
router.get('/worker/:workerId', Item.getItemByWorkerName);

module.exports = router;
