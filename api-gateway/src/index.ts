/** @format */

import express, { Request, Response, NextFunction, Express } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "UP" });
});
// routes

// 404 error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({ message: "Resource not found." });
});
// global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return res.status(500).json({ message: "Something went wrong." });
});
const server = http.createServer(app);
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Application running on port ${port}`);
});
