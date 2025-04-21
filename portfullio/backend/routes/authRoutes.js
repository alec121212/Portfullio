import express from 'express';
import { googleAuth } from '../controllers/googleAuthController.js';

const router = express.Router();

router.post('/google', googleAuth);

export default router;