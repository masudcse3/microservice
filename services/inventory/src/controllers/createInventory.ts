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
      console.error(validationSchema.error.errors);
      res.status(422).json({ error: "Zod validation error" });
    }
    if (validationSchema.success) {
      const { productId, availableQuantity } = validationSchema.data;
      const inventory = await prisma.inventory.create({
        data: {
          productId,
          availableQuantity,
        },
      });
      res
        .status(201)
        .json({ message: "Inventory created successfully", data: inventory });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Invalid data format" });
  }
};

export default createInventory;
