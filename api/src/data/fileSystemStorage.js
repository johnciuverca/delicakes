import fs from 'fs/promises';
import path from 'path';

const __serverRoot = process.cwd();
const __storageDir = path.join(__serverRoot, '.storage');

// Store transactions.json in the api/src/.storage directory
const STORAGE_FILE = path.join(__storageDir, 'transactions.json');
fs.access(STORAGE_FILE).catch(() => {
      const json = JSON.stringify({ transactions: [], nextId: 1 }, null, 2);
      fs.writeFile(STORAGE_FILE, json);
});

// Get all transactions
export function getAllTransactions() {
      const dataPromise = fs.readFile(STORAGE_FILE, 'utf8');
      return dataPromise.then((data) => {
            const result = JSON.parse(data);
            return result.transactions;
      })
}

// Add a new transaction
export function addTransaction(description, amount, recordDate) {
      const dataPromise = fs.readFile(STORAGE_FILE, 'utf8');

      let concludeSuccess;
      let concludeFailure;
      const resultPromise = new Promise((res, rej) => {
            concludeSuccess = res;
            concludeFailure = rej;
      });

      dataPromise.then((data) => {
            const result = JSON.parse(data);
            const newTransaction = {
                  id: result.nextId++,
                  description,
                  amount,
                  recordDate
            }
            result.transactions.push(newTransaction);
            const newState = JSON.stringify(result);

            return fs.writeFile(STORAGE_FILE, newState)
                  .then(() => concludeSuccess(newTransaction))
                  .catch(reason => concludeFailure(reason));
      });

      return resultPromise;
}

// Edit a transaction
export function updateTransaction(id, description, amount, recordDate) {
      const dataPromise = fs.readFile(STORAGE_FILE, 'utf-8');
      const updatedPromise = dataPromise.then((data) => {
            const dbState = JSON.parse(data);
            const target = dbState.transactions.find(transaction => transaction.id == id);
            if (target) {
                  target.description = description;
                  target.amount = amount;
                  target.recordDate = recordDate;
            };
            const result = JSON.stringify(dbState);
            fs.writeFile(STORAGE_FILE, result);
      });
      return updatedPromise;
}

// Delete a transaction
export function deleteTransaction(id) {
      const dataPromise = fs.readFile(STORAGE_FILE, 'utf-8');
      const deletePromise = dataPromise.then((data) => {
            const dbState = JSON.parse(data);
            const targetIndex = dbState.transactions.findIndex(transaction => transaction.id == id);

            if (targetIndex !== -1) {
                  dbState.transactions.splice(targetIndex, 1);
            }
            const result = JSON.stringify(dbState);
            fs.writeFile(STORAGE_FILE, result);
      });
      return deletePromise;
}
