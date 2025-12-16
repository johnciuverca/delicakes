import { Transaction } from '../types/transaction';

export function createTransactionElement(
      transaction: Transaction,
      onRemove: (id: string) => void,
      onEdit: (id: string, description: string, amount: number, recordDate: string) => void
): HTMLElement;