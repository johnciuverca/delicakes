import "dotenv/config";

import express, { type Request, type Response } from "express";
import cors from "cors";

import transactionRoutes from "./transactions.js";

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3100;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Delicakes Money Tracker API" });
});

app.use("/api/transactions", transactionRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
