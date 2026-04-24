import "dotenv/config";

import express, { type Request, type Response } from "express";
import cors from "cors";

import transactionRoutes from "./model/transactions.js";
import {
  addFavoriteRecipeHandler,
  addRecipeHandler,
  deleteRecipesHandler,
  getFavoritesRecipesHandler,
  getRecipesHandler,
  removeFavoriteRecipeHandler,
} from "./handlers/recipes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3100;
const ENVIRONMENT = process.env.ENVIRONMENT || "DEV";

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Delicakes Money Tracker API" });
});

app.use("/api/transactions", transactionRoutes);

app.get("/api/recipes", getRecipesHandler);
app.post("/api/recipes", authMiddleware, addRecipeHandler);
app.delete("/api/recipes", authMiddleware, deleteRecipesHandler);

app.get("/api/favorites", getFavoritesRecipesHandler);
app.post("/api/favorites", authMiddleware, addFavoriteRecipeHandler);
app.delete("/api/favorites", authMiddleware, removeFavoriteRecipeHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${ENVIRONMENT} mode`);
});
