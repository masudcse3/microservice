/** @format */

import { Request, Response, NextFunction } from "express";
import prisma from "@/prisma";
import { sendEmailSchema } from "@/schemas";
import { sendEmailTo } from "@/utils";
const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  const parseBody = sendEmailSchema.safeParse(req.body);
  if (!parseBody.success) {
    return res
      .status(422)
      .json({ Message: "Validation error.", Error: parseBody.error.errors });
  }

  const { recepient, subject, body } = parseBody.data;
  try {
    // send an email notification
    await sendEmailTo({ recepient, subject, body });
    // create a new email record
    await prisma.email.create({
      data: parseBody.data,
    });
    return res
      .status(200)
      .json({ Message: `Email Send Sucessfully to ${recepient}` });
  } catch (error) {
    next(error);
  }
};

export default sendEmail;
