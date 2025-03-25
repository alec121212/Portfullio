const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },

  ethWallet: [
    {
      address: { type: String, required: true, unique: true },
      addedAt: { type: Date, default: Date.now }
    }
  ]
});