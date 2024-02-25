/** @format */

import { z } from "zod";

export const productCreateDTOSchema = z.object({
  sku: z.string().min(5).max(255),
  name: z.string().min(5).max(255),
  description: z.string().min(10).max(1000).optional(),
  price: z.number(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const productUpdateDTOSchema = productCreateDTOSchema
  .omit({ sku: true })
  .partial();
