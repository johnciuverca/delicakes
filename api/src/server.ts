import "dotenv/config";

import express, { type Request, type Response } from "express";
import cors from "cors";

import transactionRoutes from "./model/transactions.js";
import {
  addRecipeHandler,
  deleteRecipesHandler,
  getRecipesHandler,
} from "./handlers/recipes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3100;
const ENVIRONMENT = process.env.ENVIRONMENT || "DEV";

const corsMiddleware = cors();
const jsonMiddleware = express.json();

app.use(corsMiddleware);
app.use(authMiddleware);
app.use(jsonMiddleware);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Delicakes Money Tracker API" });
});

app.use("/api/transactions", transactionRoutes);

app.get("/api/recipes", getRecipesHandler);
app.post("/api/recipes", addRecipeHandler);
app.delete("/api/recipes", deleteRecipesHandler);

// app.get("/api/favorites", getFavoriteRecipesHandler);
// app.post("/api/favorites", addFavoriteHandler);
// app.delete("/api/favorites", removeFavoriteHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${ENVIRONMENT} mode`);
});
