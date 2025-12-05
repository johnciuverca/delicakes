import { formatCurrency } from "./utils/helpers.js";
import { createTransactionElement } from "./components/transaction.js";
import { dataProvider } from "./providers/dataProvider.js";

// Entry point
const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");
const recordDateEl = document.getElementById("record-date");

transactionFormEl.addEventListener("submit", addTransaction)

refreshExpenseTracker();

// Functions
function addTransaction(e) {
      e.preventDefault();

      dataProvider.insert({
            description: descriptionEl.value.trim(),
            amount: parseFloat(amountEl.value),
            recordDate: recordDateEl.value
      }).then(() => {
            refreshExpenseTracker();
      });
      transactionFormEl.reset();
}

function updateTransactionList() {
      transactionListEl.innerHTML = "";

      const transactionsPromise = dataProvider.readAll();
      transactionsPromise.then(transactions => {
            const sortedTransactions = [...transactions].reverse();
            sortedTransactions.forEach(uiTransaction => {
                  const transactionEl = createTransactionElement(uiTransaction, removeTransaction, editTransaction);
                  transactionListEl.appendChild(transactionEl);
            });
      });
}

function updateSummary() {

      const transactionsPromise = dataProvider.readAll();

      transactionsPromise.then(transactions => {
            const balance = transactions.reduce(
                  (acc, transaction) => acc + transaction.amount, 0
            );

            const income = transactions
                  .filter(transaction => transaction.amount > 0)
                  .reduce((acc, transaction) => acc + transaction.amount, 0);

            const expense = transactions
                  .filter(transaction => transaction.amount < 0)
                  .reduce((acc, transaction) => acc + transaction.amount, 0);

            balanceEl.textContent = formatCurrency(balance);
            incomeAmountEl.textContent = formatCurrency(income);
            expenseAmountEl.textContent = formatCurrency((expense));
      });
}

function editTransaction(id, description, amount, recordDate) {

      let inputDescription = prompt("Enter new DESCRIPTION:", description);
      do {
            if (inputDescription === "") {
                  inputDescription = prompt("Descrption cannot be empty. Enter new DESCRIPITION: ");
            }
            if (inputDescription === null) return;
      } while (inputDescription === "");

      let inputRecordDate = prompt("Enter new RECORD DATE (DD-MM-YYYY):", recordDate);
      do {
            if (inputRecordDate === "") {
                  inputRecordDate = prompt("Record date cannot be empty. Enter new RECORD DATE (DD-MM-YYYY): ");
            }
            if (inputRecordDate === null) return;
      } while (inputRecordDate === "");

      let inputAmountValue;
      let inputAmount = prompt("Enter new AMOUNT:", amount);
      do {
            if (inputAmount === null) return;
            inputAmountValue = parseFloat(inputAmount);
            if (isNaN(inputAmountValue)) {
                  inputAmount = prompt("Amount must be a number. Enter new AMOUNT:");
            } else if (inputAmount === "") {
                  inputAmount = prompt("Amount cannot be empty. Enter new AMOUNT:");
            }

      } while (isNaN(inputAmountValue));

      const dataIsComing = dataProvider.update(id, {
            description: inputDescription,
            recordDate: inputRecordDate,
            amount: inputAmountValue,
      });

      dataIsComing.then((obj) => {
            console.log(obj);
            refreshExpenseTracker();
      })
}

function removeTransaction(id) {
      dataProvider
            .remove(id)
            .then(() => {
                  refreshExpenseTracker();
            });
}

function refreshExpenseTracker() {
      updateSummary();
      updateTransactionList();
}


