import mongoose from "mongoose";

interface IUser {
  name: string;
  walletAddress: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  walletAddress: { type: String, required: true, unique: true },
});

const User = mongoose.model<IUser>("User", UserSchema);
export { IUser, User };