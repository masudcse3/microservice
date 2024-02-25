/** @format */

import { NextFunction, Request, Response } from "express";
import prisma from "@/prisma";
import { createInventorySchema } from "../schemas";
const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationSchema = createInventorySchema.safeParse(req.body);
    if (!validationSchema.success) {
      return res.status(422).json({
        message: "Zod validation error",
        error: validationSchema.error.errors,
      });
    }
    if (validationSchema.success) {
      const { availableQuantity, sku, productName } = validationSchema.data;
      const inventory = await prisma.inventory.create({
        data: {
          productName,
          sku,
          availableQuantity,
          histories: {
            create: {
              actionType: "IN",
              quantity: availableQuantity,
              lastQuantity: 0,
              currentQuantity: availableQuantity,
            },
          },
        },
      });

      res.status(201).json({
        message: "Inventory created successfully",
        data: inventory,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Invalid data format" });
  }
};

export default createInventory;
