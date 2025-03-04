import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import cors from "cors";
import dotenv from "dotenv";
import { User } from "./Models/User";
import { UserSchema } from "./Schemas/userSchema";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.post("/users", async (req: Request, res: Response) => {
  try {
    const parsedData = UserSchema.parse(req.body);
    const user = new User(parsedData);
    await user.save();
    res.status(201).json(user);
    res.status(200).send('Received data');
  } catch (err) {
    if (err instanceof ZodError) {
      console.error(err.errors);
    } else {
      console.error('Unknown error:', err);
    }
  }
});

app.get("/users", async (_req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
});

app.listen(5000, () => console.log("Server running on port 5000, "));