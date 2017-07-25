const express = require('express');

const router = express.Router();
const Item = require('../controllers/item');

router.post('/', Item.create);
router.post('/delegate', Item.delegateItem);
router.post('/description', Item.description);
// router.post('/progress', Item.updateProgress);
router.post('/progress', Item.addNewProgress);
router.post('/target', Item.updateTargetScore);
router.post('/bobot', Item.updateBobot);
router.post('/unit', Item.updateUnitName);
router.get('/', Item.gets);
router.get('/info', Item.getItemWithInfo);
router.get('/:itemId', Item.getItemById);
router.get('/category/:categoryId', Item.getItemByCategoryName);
router.get('/worker/:workerId', Item.getItemByWorkerName);

module.exports = router;
