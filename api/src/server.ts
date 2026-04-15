import 'dotenv/config';

import express, { type Request, type Response } from 'express';
import cors from 'cors';

import transactionRoutes from './model/transactions.js';
import { addRecipeHandler, deleteRecipesHandler, getRecipesHandler } from './handlers/recipes.js';

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3100;
const ENVIRONMENT = process.env.ENVIRONMENT || 'DEV';

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Delicakes Money Tracker API' });
});

app.use('/api/transactions', transactionRoutes);

app.post('/api/recipes', addRecipeHandler);

app.get('/api/recipes', getRecipesHandler);

app.delete('/api/recipes', deleteRecipesHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT} in ${ENVIRONMENT} mode`);
});
