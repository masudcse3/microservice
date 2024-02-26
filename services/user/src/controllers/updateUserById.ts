/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { updateUserDTOSchema } from "@/schemas";
const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const parseBody = updateUserDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res
        .status(422)
        .json({ Message: "validation error.", Error: parseBody.error.errors });
    }
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...parseBody.data,
        DOB: new Date((parseBody.data.DOB as any) || user.DOB),
      },
    });

    return res.status(200).json({
      message: "Update successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export default updateUserById;
