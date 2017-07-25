const express = require('express');

const router = express.Router();
const Category = require('../controllers/category');

router.post('/item', Category.assignToItem);
router.post('/', Category.create);
router.post('/top', Category.createTop);
router.post('/top/assign', Category.assignCatToTop);
router.delete('/:categoryId', Category.delete);
router.put('/:categoryId', Category.edit);
router.get('/', Category.gets);
router.get('/top', Category.getsTopCategory);

module.exports = router;
