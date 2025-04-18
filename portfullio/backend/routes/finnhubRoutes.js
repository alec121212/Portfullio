const express = require('express');
const router = express.Router();
const { getAssetQuote, getStockHistory } = require('../controllers/finnhubController');

router.get('/asset/:symbol', getAssetQuote);
router.get('/stock/:symbol/history', getStockHistory);

module.exports = router;
