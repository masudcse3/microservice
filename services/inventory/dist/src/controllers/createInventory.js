"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/prisma"));
const schemas_1 = require("../schemas");
const createInventory = async (req, res, next) => {
    try {
        const validationSchema = schemas_1.createInventorySchema.safeParse(req.body);
        if (!validationSchema.success) {
            console.error(validationSchema.error.errors);
            res.status(422).json({ error: "Zod validation error" });
        }
        if (validationSchema.success) {
            const { productId, availableQuantity, sku } = validationSchema.data;
            const inventory = await prisma_1.default.inventory.create({
                data: {
                    productId,
                    availableQuantity,
                    sku,
                },
            });
            res
                .status(201)
                .json({ message: "Inventory created successfully", data: inventory });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: "Invalid data format" });
    }
};
exports.default = createInventory;
//# sourceMappingURL=createInventory.js.map