/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { productCreateDTOSchema } from "@/schemas";
import axios from "axios";

const getAProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { id: id } });
    if (!product) {
      return res.status(404).json({ message: "No product found" });
    }
    return res.status(200).json({
      message: "Product found.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export default getAProductById;
