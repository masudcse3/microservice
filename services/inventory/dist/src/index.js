"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const controllers_1 = require("./controllers");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (req, res) => {
    res.status(200).json({ message: "UP" });
});
// other rouse
app.post("/inventories", controllers_1.createInventory);
app.get("/inventories", controllers_1.getAllInventories);
// 404 Error handler
app.use((_req, res) => {
    return res.status(404).json({ message: "404 Resource not found." });
});
// Global Error handler
app.use((err, req, res, next) => {
    if (err.name === "PrismaClientKnownRequestError") {
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
//# sourceMappingURL=index.js.map