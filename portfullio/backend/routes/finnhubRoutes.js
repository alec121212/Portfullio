import express from 'express';
import { getAssetQuote, getStockHistory } from '../controllers/finnhubController.js';

const router = express.Router();

router.get('/asset/:symbol', getAssetQuote);
router.get('/stock/:symbol/history', getStockHistory);

export default router;