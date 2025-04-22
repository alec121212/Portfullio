import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  createLinkToken,
  exchangePublicToken,
  getInvestments,
  plaidStatus
} from '../controllers/plaidController.js';

const router = express.Router();

router.post('/create_link_token', createLinkToken);
router.post('/exchange_public_token', requireAuth, exchangePublicToken);
router.post('/investments', requireAuth, getInvestments);
router.get('/status', requireAuth, plaidStatus)

export default router;
