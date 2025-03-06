import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  walletAddress: z.string().min(1, "Invalid wallet address"),
});

export type UserInput = z.infer<typeof UserSchema>;
