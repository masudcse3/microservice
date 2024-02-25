/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { productCreateDTOSchema, productUpdateDTOSchema } from "@/schemas";
import axios from "axios";
import { parse } from "path";

const updateAProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const parseBody = productUpdateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      console.log(parseBody.error.errors);
      return res.status(422).json({ message: "Invalid data" });
    }
    const product = await prisma.product.findUnique({ where: { id: id } });
    if (!product) {
      return res.status(404).json({
        message: "No product found for update",
      });
    }
    const updatedProduct = await prisma.product.update({
      where: {
        id: id,
      },
      data: parseBody.data,
    });

    return res.status(200).json({
      message: "Update successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export default updateAProductById;
