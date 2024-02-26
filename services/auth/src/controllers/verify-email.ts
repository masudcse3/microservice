/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { codeSchema } from "@/schemas";

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // verify code
    const parseBody = codeSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res
        .status(422)
        .json({ Message: "Validation error.", Error: parseBody.error.errors });
    }
    const { code } = parseBody.data;
    // check if the code is valid
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        code: code,
      },
    });
    if (!verificationCode) {
      return res.status(400).json({ message: "Invalid Code" });
    }
    if (verificationCode.expiredAt.getTime() < new Date().getTime()) {
      return res.status(400).json({ message: "Code Expired." });
    }
    if (
      verificationCode.status === "USED" ||
      verificationCode.type !== "ACCOUNT_ACTIVATION"
    ) {
      return res.status(400).json({ message: "Invalid Code" });
    }
    // find the user account associated

    await prisma.user.update({
      where: {
        id: verificationCode.userId,
      },
      data: {
        status: "ACTIVE",
        verified: true,
      },
    });
    await prisma.verificationCode.update({
      where: {
        id: verificationCode.id,
      },
      data: {
        status: "USED",
      },
    });
    return res
      .status(200)
      .json({ message: "Your account has been activated successfully" });
  } catch (error) {
    next(error);
  }
};

export default verifyEmail;
