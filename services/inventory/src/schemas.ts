/** @format */

import { z } from "zod";
export const createInventorySchema = z.object({
  productId: z.string(),
  availableQuantity: z.number().int().optional().default(0),
});
