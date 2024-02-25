"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/prisma"));
const getAllInventories = async (req, res, next) => {
    try {
        const allInventories = await prisma_1.default.inventory.findMany();
        return res.status(200).json({
            message: "These inventories has retrived",
            data: allInventories,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = getAllInventories;
//# sourceMappingURL=getAllInventories.js.map