import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { saveWallet, getWallet } from "../controllers/cryptoController.js";

const router = express.Router();

router.post("/wallet", requireAuth, saveWallet);
router.get ("/wallet", requireAuth, getWallet);

export default router;