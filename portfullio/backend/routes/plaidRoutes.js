import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  createLinkToken,
  exchangePublicToken,
  getInvestments
} from '../controllers/plaidController.js';

const router = express.Router();

router.post('/create_link_token', createLinkToken);
router.post('/exchange_public_token', exchangePublicToken);
router.post('/investments', getInvestments);

export default router;
