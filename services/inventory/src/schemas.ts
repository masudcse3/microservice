/** @format */

import { z } from "zod";

export const createInventorySchema = z.object({
  productName: z.string().optional(),
  sku: z.string(),
  availableQuantity: z.number().int(),
});

export const updateInventorySchema = z.object({
  actionType: z.enum(["IN", "OUT"]).default("IN"),
  quantity: z.number().int().default(0),
});
