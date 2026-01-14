import React from 'react';
import { formatCurrency } from '../utils/helpers';
import type { Transaction } from '../model/types';

type TransactionProps = {
      transaction: Transaction;
      onRemove: (id: string) => void;
      editTransaction: (id: string, description: string, amount: number, recordDate: string) => void;
};

const Transaction = ({ transaction, onRemove, editTransaction }: TransactionProps) => {
      return (
            <li className={`transaction ${transaction.amount > 0 ? "income" : "expense"}`}>
                  <span>{transaction.description}</span>
                  <span>{transaction.recordDate}</span>
                  <span>{formatCurrency(transaction.amount)}</span>
                  <span>
                        <button className='edit-btn' onClick={() => editTransaction(transaction.id, transaction.description, transaction.amount, transaction.recordDate)}>
                              📝
                        </button>
                        <button className='delete-btn' onClick={() => onRemove(transaction.id)}>
                              ❌
                        </button>
                  </span>
            </li>
      );
};

export default Transaction;