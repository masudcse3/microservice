/** @format */

import { NextFunction, Request, Response } from "express";
import prisma from "@/prisma";
import { updateInventorySchema } from "@/schemas";
const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const inventory = await prisma.inventory.findUnique({ where: { id: id } });
    if (!inventory) {
      return res.status(404).json({ message: "No Inventory found for update" });
    }
    const parseBody = updateInventorySchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(404).json({ Error: parseBody.error.errors });
    }
    const { actionType, quantity } = parseBody.data;
    let updatedQuantity = inventory.availableQuantity || 0;

    if (actionType === "IN") {
      updatedQuantity += quantity;
    } else if (actionType === "OUT") {
      updatedQuantity -= quantity;
    } else {
      updatedQuantity = inventory.availableQuantity || 0;
    }

    const updatedInventory = await prisma.inventory.update({
      where: {
        id: id,
      },
      data: {
        availableQuantity: updatedQuantity,
        histories: {
          create: {
            actionType,
            quantity,
            lastQuantity: inventory.availableQuantity || 0,
            currentQuantity: updatedQuantity,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Inventory updated sucessfully",
      updatedInventory,
    });
  } catch (error) {
    next(error);
  }
};
export default updateInventory;
