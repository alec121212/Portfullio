import crypto from "../models/crypto.js";

export const saveWallet = async (req, res) => {
  const { address } = req.body;
  try {
    await crypto.findOneAndUpdate(
      { email: req.userId },
      { address },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ saved: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWallet = async (req, res) => {
  const wallet = await crypto.findOne({ email: req.userId });
  res.json({
    exists: Boolean(wallet),
    address: wallet?.address || null,
  });
};
