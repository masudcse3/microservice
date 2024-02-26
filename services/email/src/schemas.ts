/** @format */

import { z } from "zod";
export const sendEmailSchema = z.object({
  authUserId: z.string(),
  recepient: z.string().email(),
  subject: z.string(),
  source: z
    .enum(["ACCOUNT_ACTIVATION", "EMAIL_CHANGE", "RESET_PASSWORD"])
    .default("ACCOUNT_ACTIVATION"),
  body: z.string(),
});
