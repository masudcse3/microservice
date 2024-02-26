/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { field } = req.query;
  console.log(field);

  try {
    let user;
    if (field === "authUserId") {
      user = await prisma.user.findUnique({ where: { authUserId: id } });
    } else {
      user = await prisma.user.findUnique({ where: { id: id } });
    }
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export default getUserById;
