import { Router, type Request, type Response } from "express";

import {
  addTransaction,
  deleteTransaction,
  getAllTransactions,
  updateTransaction,
} from "../data/fileSystemStorage.js";

const router = Router();

type TransactionCreateBody = {
  description?: string;
  amount?: number;
  recordDate?: string;
};

type TransactionUpdateBody = {
  description?: string;
  amount?: number;
  recordDate?: string;
};

type TransactionDeleteBody = {
  id?: number | string;
};

router.get("/", async (_req: Request, res: Response) => {
  try {
    const data = await getAllTransactions();
    res.json(data);
  } catch (caught) {
    // eslint-disable-next-line no-console
    console.error("Error getting transactions:", caught);
    res.status(500).json({ error: "Failed to retrieve transactions" });
  }
});

router.post(
  "/",
  async (req: Request<Record<string, never>, unknown, TransactionCreateBody>, res: Response) => {
    try {
      const { description, amount, recordDate } = req.body;
      const created = await addTransaction(description ?? "", amount ?? 0, recordDate ?? "");
      res.json(created);
    } catch (caught) {
      // eslint-disable-next-line no-console
      console.error("Error adding transaction:", caught);
      res.status(500).json({ reason: "Failed to add transaction" });
    }
  },
);

router.put(
  "/:id",
  async (
    req: Request<{ id: string }, unknown, TransactionUpdateBody>,
    res: Response,
  ) => {
    try {
      const id = req.params.id;
      const { description, amount, recordDate } = req.body;
      await updateTransaction(id, description ?? "", amount ?? 0, recordDate ?? "");
      res.json({});
    } catch (caught) {
      // eslint-disable-next-line no-console
      console.error("Error updating transaction:", caught);
      res.status(500).json({ error: "Failed to update transaction" });
    }
  },
);

router.delete(
  "/",
  async (req: Request<Record<string, never>, unknown, TransactionDeleteBody>, res: Response) => {
    try {
      const id = req.body.id;
      await deleteTransaction(id ?? "");
      res.json({});
    } catch (caught) {
      // eslint-disable-next-line no-console
      console.error("Error deleting transaction:", caught);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  },
);

export default router;
