import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('user', userSchema)