/** @format */

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/prisma";
import { loginAccountSchema } from "@/schemas";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseBody = loginAccountSchema.safeParse(req.body);
    const ipAddress = req.ip || req.socket.remoteAddress || "";
    const userAgent = req.get("User-Agent") || "";
    if (!parseBody.success) {
      return res
        .status(422)
        .json({ Message: "validation error.", Error: parseBody.error.errors });
    }
    const { username, password } = parseBody.data;
    // check is the user exists
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(400).json({ message: "Username not found" });
    }

    // check if the password is correct
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      await prisma.loginHistory.create({
        data: {
          ipAddress: ipAddress,
          userAgent: userAgent,
          attempt: "FAILED",
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      return res.status(400).json({ message: "Wrong Password." });
    }
    if (user.status !== "ACTIVE") {
      await prisma.loginHistory.create({
        data: {
          ipAddress: ipAddress,
          userAgent: userAgent,
          attempt: "FAILED",
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      return res
        .status(400)
        .json({ message: `Your account is now ${user.status.toLowerCase()}` });
    }
    if (!user.verified) {
      await prisma.loginHistory.create({
        data: {
          ipAddress: ipAddress,
          userAgent: userAgent,
          attempt: "FAILED",
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      return res.status(400).json({
        message: `Your account id pending for verification. Please check your email. ${user.email}`,
      });
    }
    // create a accesstoken
    const secretKey: any = process.env.JWT_ACCESS_KEY;
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      verified: user.verified,
      status: user.status,
    };
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: "30d" });
    await prisma.loginHistory.create({
      data: {
        ipAddress: ipAddress,
        userAgent: userAgent,
        attempt: "SUCCESS",
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return res
      .status(200)
      .json({ message: "Login successful.", accessToken: accessToken });
  } catch (error) {
    next(error);
  }
};

export default login;
