import "dotenv/config";
import express from "express";
import cors from "cors";

import transactionRoutes from "./model/transactions.js";
import {
  addRecipeHandler,
  deleteRecipesHandler,
  getRecipesHandler,
} from "./handlers/recipes.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";


const PORT = process.env.PORT ? Number(process.env.PORT) : 3100;
const ENVIRONMENT = process.env.ENVIRONMENT || "DEV";

const app = express();

const corsMiddleware = cors();
const jsonMiddleware = express.json();

app.use(corsMiddleware);
app.use(authMiddleware);
app.use(jsonMiddleware);

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
