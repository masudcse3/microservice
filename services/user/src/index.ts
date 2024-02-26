/** @format */

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import dovenv from "dotenv";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
} from "@/controllers";

dovenv.config();
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "UP" });
});
// other rouse
app.get("/users/:id", getUserById);
app.patch("/users/:id", updateUserById);
app.get("/users", getAllUsers);
app.post("/users", createUser);
// 404 Error handler
app.use((_req, res) => {
  return res.status(404).json({ message: "404 Resource not found." });
});
// Global Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "PrismaClientKnownRequestError") {
    console.log(err.stack);
    return res.status(403).json({ message: "Bad request" });
  }
  console.log(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

// run the server
const port = process.env.PORT || 4005;
const service_name = process.env.SERVICE_NAME || "User Service";
app.listen(port, () => {
  console.log(`${service_name} is running on port ${port}`);
});
