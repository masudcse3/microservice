/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { createUserDTOSchema } from "@/schemas";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseBody = createUserDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res
        .status(422)
        .json({ Message: "validation error.", Error: parseBody.error.errors });
    }
    const user = await prisma.user.findUnique({
      where: {
        authUserId: parseBody.data.authUserId,
      },
    });
    if (user) {
      return res.status(404).json({ message: "User Already Registered." });
    }
    const createNewUser = await prisma.user.create({
      data: parseBody.data,
    });

    return res.status(200).json({
      message: "User Created Successfully",
      data: createNewUser,
    });
  } catch (error) {
    next(error);
  }
};
export default createUser;
