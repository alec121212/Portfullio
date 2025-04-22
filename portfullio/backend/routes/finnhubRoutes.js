import express from 'express';
import { getAssetQuote, getStockHistory, getStockHistoryUnlimited } from '../controllers/finnhubController.js';

const router = express.Router();

router.get('/asset/:symbol', getAssetQuote);
router.get('/stock/:symbol/history', getStockHistory);
router.get('/stock/:symbol/historyUnlimited', getStockHistoryUnlimited);

export default router;