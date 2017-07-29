const express = require('express');

const router = express.Router();
const Item = require('../controllers/item');
const helper = require('../helpers/verify');

router.post('/', helper.isLogin, Item.create);
router.post('/delegate', helper.isLogin, Item.delegateItem);
router.post('/description', helper.isLogin, Item.description);
router.post('/progress', helper.isLogin, Item.addNewProgress);
router.post('/target', helper.isLogin, Item.updateTargetScore);
router.post('/bobot', helper.isLogin, Item.updateBobot);
router.post('/unit', helper.isLogin, Item.updateUnitName);
router.get('/', helper.isLogin, Item.gets);
router.get('/info', helper.isLogin, Item.getItemWithInfo);
router.get('/:itemId', helper.isLogin, Item.getItemById);
router.get('/category/:categoryId', helper.isLogin, Item.getItemByCategoryName);
router.get('/worker/:workerId', helper.isLogin, Item.getItemByWorkerName);

module.exports = router;
