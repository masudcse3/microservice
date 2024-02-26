/** @format */
import { Request, Response, NextFunction } from "express";
import bcrype from "bcryptjs";
import prisma from "@/prisma";
import axios from "axios";
import { generateCode } from "@/utils";

import { registerAccountSchema, registerAccountDTO } from "@/schemas";
const registerAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseBody = registerAccountSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res
        .status(422)
        .json({ Message: "Validation error.", Error: parseBody.error.errors });
    }
    const { username, email, password, role, verified, status } =
      parseBody.data;
    // check is the user exists
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (user) {
      return res
        .status(400)
        .json({ message: `Username ${username} already taken` });
    }

    // genarate a hash password with the user password
    const salt = await bcrype.genSalt(10);
    const hashedPassword = await bcrype.hash(password, salt);

    // create a new account for the user
    const newAccount = await prisma.user.create({
      data: { ...parseBody.data, password: hashedPassword },

      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
    // TODO: generate and send a email verifivcation code
    const code = generateCode();
    await prisma.verificationCode.create({
      data: {
        code: code,
        status: "PENDING",
        type: "ACCOUNT_ACTIVATION",
        expiredAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        user: {
          connect: {
            id: newAccount.id,
          },
        },
      },
    });
    // send email to the user
    const EMAIL_SERVICE_URL =
      process.env.EMAIL_SERVICE_URL || "http://localhost:4006";
    await axios.post(`${EMAIL_SERVICE_URL}/emails/send`, {
      authUserId: newAccount.id,
      recepient: newAccount.email,
      subject: "Account Activation",
      source: "ACCOUNT_ACTIVATION",
      body: `Hi ${newAccount.username}, Your account verification code is ${code}`,
    });

    // create a user profile account
    const USER_SERVICE_URL =
      process.env.USER_SERVICE_URL || "http://localhost:4005";
    await axios.post(`${USER_SERVICE_URL}/users`, {
      authUserId: newAccount.id,
      email: newAccount.email,
    });
    // Response
    return res.status(200).json({
      message:
        "your account created successfully. please check your email for verification.",
      data: newAccount,
    });
  } catch (error) {
    next(error);
  }
};

export default registerAccount;
