/** @format */

// step 1: verify the user email and password is correct
// step 2: send an email with a validation code
// step 3: validate the user code
// step 4: open a link for update the password /auth/reset-password?email=user@example.com&code=12345
// step 6: take new password
// step 7: update the password and return response

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import axios from "axios";
import prisma from "@/prisma";
import { resetPasswordSchema } from "@/schemas";
import { generateCode } from "@/utils";
import { email_service_url } from "@/config";

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parseBody = resetPasswordSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res
        .status(422)
        .json({ message: "Validation Failed", Error: parseBody.error.errors });
    }
    const { email, password } = parseBody.data;
    const user = await prisma.user.findFirst({ where: { email: email } });
    console.log("USER", user);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    // check password is valid
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const code = generateCode();
    await prisma.verificationCode.create({
      data: {
        code: code,
        status: "PENDING",
        type: "RESET_PASSWORD",
        expiredAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await axios.post(`${email_service_url}/emails/send`, {
      authUserId: user.id,
      recepient: user.email,
      subject: "Password Reset",
      source: "RESET_PASSWORD",
      body: `Hi ${user.username}, Your password reset code is ${code}`,
    });
    return res.status(200).json({
      message: "We sent a password reset link to your email. Please check.",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default resetPassword;
