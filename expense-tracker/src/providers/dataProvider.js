import { deleteTransaction, fetchAllTransactions, insertTransaction, updateTransaction } from "./internals/dbProviderUtils.js";
import { insert as insertIntoLocalStorage } from "./internals/localStorageUtils.js";
import { readAll as readAllFromLocalStorage } from "./internals/localStorageUtils.js";
import { removeTransaction as removeFromLocalStorage } from "./internals/localStorageUtils.js";

const dataPoviderImpl = dbProviderAdaptor();

export const dataProvider = {
      /**
       * Read all transactions from database
       * @returns {Promise<Array>}  Array of all transactions
       */
      readAll() {
            return dataPoviderImpl.readAll();
      },

      /**
       *  Insert transaction into database
       * @param {{ description, amount }} transactionInput  The transaction data to be inserted
       * @returns {Promise<void>}
       */
      insert(transactionInput) {
            return dataPoviderImpl.insert(transactionInput);
      },

      /**
       * Update a transaction by id
       * @param {string} id The id of the object to be updated
       * @returns    -!!!!!!!!!!!!TODO!!!!!!!!!!-
       */
      update(id, inputData) {
            return dataPoviderImpl.update(id, inputData);
      },

      /**
       * Remove a transaction by id
       * @param {string} id  The id of the transaction to be removed
       * @returns {Promise<void >}
      */
      remove(id) {
            return dataPoviderImpl.remove(id);
      },
}

function localStorageProviderAdaptor() {
      return {
            insert(x) {
                  return Promise.resolve(insertIntoLocalStorage(x));
            },
            readAll() {
                  return Promise.resolve(readAllFromLocalStorage());
            },
            remove(id) {
                  return Promise.resolve(removeFromLocalStorage(id));
            }
      };
};

function dbProviderAdaptor() {
      return {
            insert(x) {
                  return insertTransaction(x);
            },
            readAll() {
                  return fetchAllTransactions();
            },
            remove(id) {
                  return deleteTransaction(id);
            },
            update(id, properties) {
                  return updateTransaction(id, properties);
            }
      };
};


