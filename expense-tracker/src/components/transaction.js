import { formatCurrency } from "../utils/helpers.js";

/**
 * Creates a transaction HTML element
 * @param {{ description, amount }} transaction The transaction data
 * @param {Function} onRemove Callback function to call when the transaction is removed
 * @param {Function} editTransaction
 * @returns {HTMLElement} The transaction HTML element
 */
export function createTransactionElement(transaction, onRemove, editTransaction) {
      const li = document.createElement("li");
      li.classList.add("transaction");
      li.classList.add(transaction.amount > 0 ? "income" : "expense");

      const transactionDescSpan = document.createElement("span");
      transactionDescSpan.textContent = transaction.description;

      const transactionRecordDateSpan = document.createElement("span");
      transactionRecordDateSpan.textContent = transaction.recordDate;

      const transactionAmountSpan = document.createElement("span");
      transactionAmountSpan.textContent = formatCurrency(transaction.amount);

      const buttonsContainer = document.createElement("span");

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "❌";
      deleteBtn.onclick = () => onRemove(transaction.id);

      const editBtn = document.createElement("button");
      editBtn.classList.add("edit-btn");
      editBtn.textContent = "📝";
      editBtn.onclick = () => editTransaction(transaction.id, transaction.description, transaction.amount, transaction.recordDate);

      buttonsContainer.appendChild(editBtn);
      buttonsContainer.appendChild(deleteBtn);

      li.appendChild(transactionDescSpan);
      li.appendChild(transactionRecordDateSpan);
      li.appendChild(transactionAmountSpan);
      li.appendChild(buttonsContainer);

      return li;
}





