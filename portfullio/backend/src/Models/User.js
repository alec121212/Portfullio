
/*import { Schema, model } from 'mongoose';

// Define the User data interface
export interface UserData {
  name: string;
  walletAddress: string;
}

// Define the User schema
const userSchema = new Schema<UserData>({
  name: { type: String, required: true },
  walletAddress: { type: String, required: true },
});

// User Model
const User = model<UserData>('User', userSchema);

export default User;
*/

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