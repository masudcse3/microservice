/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { productCreateDTOSchema } from "@/schemas";
import axios from "axios";

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany();

    if (!products) {
      return res.status(404).json({ message: "No product found." });
    }
    return res.status(200).json({
      message: "Products found",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export default getAllProducts;
