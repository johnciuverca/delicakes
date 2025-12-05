import { Router } from 'express';
import {
      getAllTransactions,
      addTransaction,
      updateTransaction,
      deleteTransaction
} from './data/fileSystemStorage.js';
import { error } from 'console';

const router = Router();

// GET all transactions
router.get('/', (req, res) => {
      getAllTransactions().then((data) => {
            res.json(data);
            console.log(getCurrentTime() + " get " + JSON.stringify(data));
      }).catch(() => {
            console.error('Error getting transactions:', error);
            res.status(500).json({ error: "Faile to retrieve transactions" });
      });
});

// POST a new transaction
router.post('/', (req, res) => {
      addTransaction(req.body.description, req.body.amount, req.body.recordDate).then((data) => {
            res.json(data);
            console.log(getCurrentTime() + " post" + JSON.stringify(data))
      }).catch((reason) => {
            console.error("Error adding transaction:", reason);
            res.status(500).json({ reason: "Failed to add transaction" });
      })
});

//UPDATE a transaction by ID
router.put('/:id', (req, res) => {
      const id = req.params.id;
      const description = req.body.description;
      const amount = req.body.amount;
      const recordDate = req.body.recordDate;
      updateTransaction(id, description, amount, recordDate).then(() => {
            res.json({});
            console.log(getCurrentTime() + " put - updated transaction " + id)
      }).catch((error) => {
            console.error("Error updatind transaction:", error);
            res.status(500).json({ error: 'Failed to update transaction' });
      });
});

// DELETE a transaction by ID
router.delete('/', (req, res) => {
      const id = req.body.id;
      deleteTransaction(id).then(() => {
            res.json({});
            console.log(getCurrentTime() + " delete: transaction " + id);
      }).catch((error) => {
            console.error('Error deleting transaction:', error);
            res.status(500).json({ error: 'Failed to delete transaction' });
      });
});

function getCurrentTime() {
      var now = new Date();
      var pretty = [
            now.getFullYear(),
            '-',
            now.getMonth() + 1,
            '-',
            now.getDate(),
            ' ',
            now.getHours(),
            ':',
            now.getMinutes(),
            ':',
            now.getSeconds()
      ].join('');
      return pretty;
}

export default router;
