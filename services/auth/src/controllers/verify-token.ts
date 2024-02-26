/** @format */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "@/prisma";
import { accessTokenSchema } from "@/schemas";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = (req.headers["authorization"] as any).split(" ")[1];

    const secretKey = process.env.JWT_ACCESS_KEY || "jwt-secret";
    const decode = jwt.verify(accessToken, secretKey);

    return res.status(200).json(decode);
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
