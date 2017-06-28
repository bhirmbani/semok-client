const express = require('express');

const router = express.Router();
const Worker = require('../controllers/worker');

router.post('/create', Worker.create);

module.exports = router;
