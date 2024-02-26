/** @format */

import { z } from "zod";

export const registerAccountSchema = z.object({
  username: z.string().min(5).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255),
  role: z
    .enum(["CUSTOMER", "USER", "MARCHENT", "ADMIN"])
    .default("USER")
    .optional(),
  verified: z.boolean().default(false).optional(),
  status: z
    .enum(["PENDING", "ACTIVE", "INACTIVE", "REJECTED"])
    .default("PENDING")
    .optional(),
});
export type registerAccountDTO = z.infer<typeof registerAccountSchema>;

export const loginAccountSchema = z.object({
  username: z.string().min(5).max(255),
  password: z.string().min(8).max(255),
});

export const codeSchema = z.object({
  code: z.string().min(5),
});
export const accessTokenSchema = z.object({
  accessToken: z.string(),
});
