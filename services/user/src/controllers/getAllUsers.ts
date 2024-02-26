/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({
      message: "Users found",
      users,
    });
  } catch (error) {
    next(error);
  }
};

export default getAllUsers;
