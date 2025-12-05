import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import transactionRoutes from './transactions.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(json());

// Routes
app.get('/', (req, res) => {
      res.json({ message: 'Delicakes Money Tracker API' });
});

app.use('/api/transactions', transactionRoutes);

// Start server
app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
});