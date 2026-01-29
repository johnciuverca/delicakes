import React, { useCallback } from 'react';
import { formatCurrency } from '../utils/helpers';
import type { Transaction, TransactionUI } from '../model/types';

type TransactionProps = {
      transaction: Transaction;
      onRemove: (id: string) => void;
      editTransaction: (id: string, description: string, amount: number, recordDate: string) => void;
};

const TransactionItem = ({ transaction, onRemove, editTransaction }: TransactionProps) => {

      const editPrompt = useCallback(() => {
            let inputDescription = prompt("Enter new DESCRIPTION:", transaction.description);
            do {
                  if (inputDescription === "") {
                        inputDescription = prompt("Descrption cannot be empty. Enter new DESCRIPITION: ");
                  }
                  if (inputDescription === null) return;
            } while (inputDescription === "");

            let inputRecordDate = prompt("Enter new RECORD DATE (DD-MM-YYYY):", transaction.recordDate);
            do {
                  if (inputRecordDate === "") {
                        inputRecordDate = prompt("Record date cannot be empty. Enter new RECORD DATE (DD-MM-YYYY): ");
                  }
                  if (inputRecordDate === null) return;
            } while (inputRecordDate === "");

            let inputAmountValue;
            let inputAmount = prompt("Enter new AMOUNT:", transaction.amount.toString());
            do {
                  if (inputAmount === null) return;
                  inputAmountValue = parseFloat(inputAmount);
                  if (isNaN(inputAmountValue)) {
                        inputAmount = prompt("Amount must be a number. Enter new AMOUNT:");
                  } else if (inputAmount === "") {
                        inputAmount = prompt("Amount cannot be empty. Enter new AMOUNT:");
                  }
            } while (isNaN(inputAmountValue));
            return {
                  description: inputDescription,
                  recordDate: inputRecordDate,
                  amount: inputAmountValue
            } as TransactionUI;
      }, [editTransaction, transaction]);


      return (
            <li className={`transaction ${transaction.amount > 0 ? "income" : "expense"}`}>
                  <span>{transaction.description}</span>
                  <span>{transaction.recordDate}</span>
                  <span>{formatCurrency(transaction.amount)}</span>
                  <span>
                        <button className='edit-btn' onClick={() => {
                              const editedTransaction = editPrompt();
                              if (!editedTransaction) return;
                              editTransaction(
                                    transaction.id,
                                    editedTransaction.description,
                                    editedTransaction.amount,
                                    editedTransaction.recordDate
                              );
                        }}>
                              📝
                        </button>
                        <button className='delete-btn' onClick={() => onRemove(transaction.id)}>
                              ❌
                        </button>
                  </span>
            </li>
      );
};

export default TransactionItem;