import type { Transaction, TransactionUI } from "../model/types";
import {
      deleteTransaction,
      fetchAllTransactions,
      insertTransaction,
      updateTransaction,
} from "./internals/dbProviderUtils";
import {
      insert as insertIntoLocalStorage,
      readAll as readAllFromLocalStorage,
      removeTransaction as removeFromLocalStorage,
} from "./internals/localStorageUtils";

export interface DataProvider {
      readAll(): Promise<Transaction[]>;
      insert(transactionInput: TransactionUI): Promise<void>;
      update(id: string | number, inputData: Partial<TransactionUI>): Promise<unknown>;
      remove(id: string | number): Promise<void>;
}

const dataProviderImpl: DataProvider = dbProviderAdaptor();

export const dataProvider: DataProvider = {
      readAll() {
            return dataProviderImpl.readAll();
      },

      insert(transactionInput) {
            return dataProviderImpl.insert(transactionInput);
      },

      update(id, inputData) {
            return dataProviderImpl.update(id, inputData);
      },

      remove(id) {
            return dataProviderImpl.remove(id);
      },
};

function localStorageProviderAdaptor(): DataProvider {
      return {
            insert(x) {
                  return Promise.resolve(insertIntoLocalStorage(x));
            },
            readAll() {
                  return Promise.resolve(readAllFromLocalStorage());
            },
            remove(id) {
                  return Promise.resolve(removeFromLocalStorage(id));
            },
            update() {
                  return Promise.reject(new Error("Not implemented"));
            },
      };
}

function dbProviderAdaptor(): DataProvider {
      return {
            insert(x) {
                  return insertTransaction(x).then(() => undefined);
            },
            readAll() {
                  return fetchAllTransactions();
            },
            remove(id) {
                  return deleteTransaction(id).then(() => undefined);
            },
            update(id, properties) {
                  return updateTransaction(id, properties);
            },
      };
}
