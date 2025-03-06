import { Schema, model } from 'mongoose';

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