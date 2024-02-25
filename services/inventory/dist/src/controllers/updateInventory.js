"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/prisma"));
const schemas_1 = require("@/schemas");
const updateInventory = async (req, res, next) => {
    const { id } = req.params;
    try {
        const inventory = await prisma_1.default.inventory.findUnique({ where: { id: id } });
        if (!inventory) {
            return res.status(404).json({ message: "No Inventory found for update" });
        }
        const parseBody = schemas_1.updateInventorySchema.safeParse(req.body);
        if (!parseBody.success) {
            return res.status(404).json({ Error: parseBody.error.errors });
        }
        const { actionType, quantity } = parseBody.data;
        inventory.availableQuantity = inventory.availableQuantity || 0;
        let updatedQunatity = inventory.availableQuantity || 0;
        if (actionType === "IN") {
            updatedQunatity += quantity;
        }
        else {
            updatedQunatity -= quantity;
        }
        await prisma_1.default.inventory.update({
            where: {
                id: id,
            },
            data: {
                availableQuantity: updatedQunatity,
            },
        });
        await prisma_1.default.inventoryHistory.create({
            data: {
                productId: inventory.productId,
                inventoryId: id,
                actionType: actionType,
                quantityChanged: quantity,
                lastQuantity: inventory.availableQuantity,
                currentQuantity: updatedQunatity,
            },
        });
        return res.status(200).json({ message: "Inventory updated sucessfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.default = updateInventory;
//# sourceMappingURL=updateInventory.js.map