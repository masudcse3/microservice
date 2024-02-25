/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
const getAllInventories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allInventories = await prisma.inventory.findMany();
    return res.status(200).json({
      message: "These inventories has retrived",
      data: allInventories,
    });
  } catch (error) {
    next(error);
  }
};

export default getAllInventories;
