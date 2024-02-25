"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInventorySchema = exports.createInventorySchema = void 0;
const zod_1 = require("zod");
exports.createInventorySchema = zod_1.z.object({
    productId: zod_1.z.string(),
    availableQuantity: zod_1.z.number().int().optional().nullable(),
    sku: zod_1.z.string().default("sku-default"),
});
exports.updateInventorySchema = zod_1.z.object({
    actionType: zod_1.z.enum(["IN", "OUT"]).default("IN"),
    quantity: zod_1.z.number().int(),
});
//# sourceMappingURL=schemas.js.map