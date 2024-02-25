/** @format */

import { NextFunction, Request, Response } from "express";
import prisma from "@/prisma";

const getInventoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const inventory = await prisma.inventory.findUnique({
      where: {
        id: id,
      },
      include: {
        histories: true,
      },
    });
    if (!inventory) {
      return res.status(404).json({ message: "No inventory found" });
    }
    return res.status(200).json({
      message: "Inventory found",
      inventory,
    });
  } catch (error) {
    next(error);
  }
};

export default getInventoryById;
