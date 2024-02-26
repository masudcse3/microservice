/** @format */

import { z } from "zod";
export const createUserDTOSchema = z.object({
  authUserId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  address: z
    .object({
      street: z.string().min(5).max(255).optional(),
      city: z.string().min(5).max(255).optional(),
      state: z.string().min(5).max(255).optional(),
      zip: z.string().min(5).max(255).optional(),
      country: z.string().min(5).max(255).optional(),
    })
    .optional(),
  phoneNo: z.string().optional(),
  DOB: z.string().optional(),
});

export const updateUserDTOSchema = createUserDTOSchema
  .omit({ email: true, authUserId: true })
  .partial();
