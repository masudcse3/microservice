/** @format */

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import dovenv from "dotenv";

import {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventory,
} from "./controllers";
dovenv.config();
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "UP" });
});
// other rouse
app.get("/inventories/:id", getInventoryById);
app.patch("/inventories/:id", updateInventory);
app.post("/inventories", createInventory);
app.get("/inventories", getAllInventories);

// 404 Error handler
app.use((_req, res) => {
  return res.status(404).json({ message: "404 Resource not found." });
});
// Global Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "PrismaClientKnownRequestError") {
    console.log(err);
    return res.status(403).json({ message: "Bad request" });
  }
  res.status(500).json({ message: "Something went wrong on the server" });
});

// run the server
const port = process.env.PORT || 4002;
const service_name = process.env.SERVICE_NAME || "Inventory Service";
app.listen(port, () => {
  console.log(`${service_name} is running on port ${port}`);
});
