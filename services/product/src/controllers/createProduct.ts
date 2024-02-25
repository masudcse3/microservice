/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { productCreateDTOSchema } from "@/schemas";
import axios from "axios";
import { INVENTORY_SERVICE_URL } from "@/config";
const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseBody = productCreateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(422).json({
        message: "Zod validation failed",
        error: parseBody.error.errors,
      });
    }
    const { sku, name, description, price, status } = parseBody.data;
    const productExist = await prisma.product.findUnique({
      where: { sku: sku },
    });

    if (productExist) {
      return res.status(400).json({ message: "This product already in shop" });
    }
    // TODO: check the inventoryID get productId instead of name
    const { data } = await axios.post(`${INVENTORY_SERVICE_URL}/inventories`, {
      productName: name,
      sku,
      availableQuantity: 0,
    });

    const product = await prisma.product.create({
      data: {
        sku,
        name,
        description,
        price,
        status,
        inventoryId: data.data.id,
      },
    });
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

export default createProduct;
