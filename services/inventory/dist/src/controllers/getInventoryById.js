"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/prisma"));
const getInventoryById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const inventory = await prisma_1.default.inventory.findUnique({
            where: {
                id: id,
            },
        });
        if (!inventory) {
            return res.status(404).json({ message: "No inventory found" });
        }
        return res.status(200).json({
            message: "Inventory found",
            inventory,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = getInventoryById;
//# sourceMappingURL=getInventoryById.js.map