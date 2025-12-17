import { formatCurrency } from "./utils/helpers.js";
import { dataProvider } from "./providers/dataProvider.js";
import { createTransactionElement } from "./components/transaction.js";
import type { Transaction, TransactionUI } from "./model/types.js";

// Entry point
const balanceEl = document.getElementById("balance") as HTMLElement;
const incomeAmountEl = document.getElementById("income-amount") as HTMLElement;
const expenseAmountEl = document.getElementById("expense-amount") as HTMLElement;
const transactionListEl = document.getElementById("transaction-list") as HTMLUListElement;
const transactionFormEl = document.getElementById("transaction-form") as HTMLFormElement;
const descriptionEl = document.getElementById("description") as HTMLInputElement;
const amountEl = document.getElementById("amount") as HTMLInputElement;
const recordDateEl = document.getElementById("record-date") as HTMLInputElement;
const sortSelectEl = document.getElementById("sort") as HTMLSelectElement;
const filterInputEl = document.getElementById("filter") as HTMLInputElement;


transactionFormEl.addEventListener("submit", addTransaction);
sortSelectEl.addEventListener("change", sortingChangeHandler);
filterInputEl.addEventListener("input", filterChangeHandler);

const filterDefault = (array: Array<any>) => array;

const localStorageSortingKey = "sorting";
let sortingAlgorithm: (<T extends TransactionUI>(array: Array<T>, reverse?: boolean) => Array<T>) = sortByDefault;
let filterAlgorithm: (<T extends TransactionUI>(array: Array<T>) => Array<T>) = filterDefault;

initializeSorting();

function initializeSorting() {
      const cachedSorting = localStorage.getItem(localStorageSortingKey);
      sortSelectEl.value = cachedSorting ?? "creationDate";
      sortSelectEl.dispatchEvent(new Event('change'));
}

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

      const transactionsPromise = dataProvider.readAll();
      transactionsPromise.then(transactions => {
            const sortedTransactions = sortingAlgorithm(transactions);
            const filteredTransactions = filterAlgorithm(sortedTransactions);
            filteredTransactions.forEach(x => {
                  const transactionEl = createTransactionElement(x, removeTransaction, editTransaction);
                  transactionListEl.appendChild(transactionEl);
            });
      });
}

// Functions for Transactions
function addTransaction(e: Event) {
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

function editTransaction(
      id: string,
      description: string,
      amount: number,
      recordDate: string
) {
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
      let inputAmount = prompt("Enter new AMOUNT:", amount.toString());
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

function removeTransaction(id: string) {
      dataProvider
            .remove(id)
            .then(() => {
                  refreshExpenseTracker();
            });
}

// Functions for Sorting
function sortingChangeHandler(event: Event) {
      const sortingCriteria = (event.target as HTMLSelectElement).value;
      sortingAlgorithm = mapSortingAlgorithm(sortingCriteria);
      localStorage.setItem(localStorageSortingKey, sortingCriteria);
      updateTransactionList();
}

function mapSortingAlgorithm<T extends TransactionUI>(
      sortingOption: string
): (array: Array<T>) => Array<T> {
      if (sortingOption === "creationDate") {
            // default
            return sortByDefault;
      } else if (sortingOption === "recordDate") {
            // newest
            return (array: Array<T>) => sortByRecordDate(array, false);
      } else if (sortingOption === "reverseRecordDate") {
            // oldest
            return (array: Array<T>) => sortByRecordDate(array, true);
      } else if (sortingOption === "alphabetic") {
            return (array: Array<T>) => sortByAlphabet(array, true);
      } else if (sortingOption === "reverseAlphabetic") {
            return (array: Array<T>) => sortByAlphabet(array, false);
      } else if (sortingOption === "amount-desc") {
            return (array: Array<T>) => sortByAmount(array, true);
      } else if (sortingOption === "amount-asc") {
            return (array: Array<T>) => sortByAmount(array, false);
      }
      throw new Error("Not implemented exception!");
}

function sortByDefault<T extends TransactionUI>(array: Array<T>): Array<T> {
      return [...array].reverse();
}

function sortByRecordDate<T extends TransactionUI>(array: Array<T>, reverse: boolean) {
      const sortedArray = [...array].sort((a, b) => {
            const [dateA, dateB] = getRecordDate(a, b);
            const sortDir = reverse === true ? -1 : 1;

            if (dateA < dateB) {
                  return sortDir;
            } else if (dateA > dateB) {
                  return -sortDir;
            } else {
                  return 0;
            }
      });
      return sortedArray;
}

function sortByAlphabet<T extends TransactionUI>(array: Array<T>, reverse: boolean) {
      const sortedArray = [...array].sort((a, b) => {
            const sortDir = reverse === true ? 1 : -1;
            const comp = a.description.localeCompare(b.description);
            return comp * sortDir;
      });
      return sortedArray;
}

function sortByAmount<T extends TransactionUI>(array: Array<T>, reverse: boolean) {
      const sortedArray = [...array].sort((a, b) => {
            const sortDir = reverse === true ? 1 : -1;
            const comp = a.amount - b.amount;
            return comp * sortDir;
      });
      return sortedArray;
}

function getRecordDate(a: TransactionUI, b: TransactionUI): [Date, Date] {
      const [dayA, monthA, yearA] = a.recordDate.split("-").map(Number);
      const [dayB, monthB, yearB] = b.recordDate.split("-").map(Number);
      const dateA = new Date(yearA!, monthA! - 1, dayA);
      const dateB = new Date(yearB!, monthB! - 1, dayB);
      return [dateA, dateB];
}

function filterChangeHandler(e: Event) {
      console.log(filterInputEl.value);

      const filterCriteria = filterInputEl.value;
      if (filterCriteria.length > 0) {
            filterAlgorithm = (transactions) => {
                  const matchingResults: typeof transactions = [];
                  transactions.forEach((transaction) => {
                        if (transaction.description.includes(filterCriteria)) {
                              matchingResults.push(transaction);
                        }
                  });
                  return matchingResults;
            };
      } else {
            filterAlgorithm = filterDefault;
      }
      updateTransactionList();
}