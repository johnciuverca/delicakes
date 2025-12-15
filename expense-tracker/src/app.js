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
const sortSelectEl = document.getElementById("sort");


transactionFormEl.addEventListener("submit", addTransaction);
sortSelectEl.addEventListener("change", sortBy);

//  Global functions
refreshExpenseTracker();

function refreshExpenseTracker() {
      updateSummary();
      updateTransactionList();
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

function updateTransactionList() {
      transactionListEl.innerHTML = "";

      const sortingCriteria = sortSelectEl.value;

      const transactionsPromise = dataProvider.readAll();
      transactionsPromise.then(transactions => {
            let sortedTransactions;
            if (sortingCriteria === "creationDate") {
                  //default
                  sortedTransactions = [...transactions].reverse();
            } else if (sortingCriteria === "recordDate") {
                  //newest
                  sortedTransactions = [...transactions].sort((a, b) => {
                        const [dayA, monthA, yearA] = a.recordDate.split("-").map(Number);
                        const [dayB, monthB, yearB] = b.recordDate.split("-").map(Number);
                        const dateA = new Date(yearA, monthA - 1, dayA);
                        const dateB = new Date(yearB, monthB - 1, dayB);
                        if (dateA < dateB) {
                              return 1;
                        } else if (dateA > dateB) {
                              return -1;
                        } else {
                              return 0;
                        }
                  });
            }
            sortedTransactions.forEach(uiTransaction => {
                  const transactionEl = createTransactionElement(uiTransaction, removeTransaction, editTransaction);
                  transactionListEl.appendChild(transactionEl);
            });
      });
}

// Functions for Transactions
function addTransaction(e) {
      e.preventDefault();

      const [year, month, day] = recordDateEl.value.split("-");
      const formattedDate = `${day}-${month}-${year}`;

      dataProvider.insert({
            description: descriptionEl.value.trim(),
            amount: parseFloat(amountEl.value),
            recordDate: formattedDate,
      }).then(() => {
            refreshExpenseTracker();
      });
      transactionFormEl.reset();
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

// Functions for Sorting
function sortBy(_event) {
      updateTransactionList();
}
