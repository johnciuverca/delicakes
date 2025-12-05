export function insert(transactionInput) {

      let transactions = readAll();

      transactions.push({
            id: Date.now(),
            description: transactionInput.description,
            amount: transactionInput.amount
      });

      localStorage.setItem("transactions", JSON.stringify(transactions));
}

export function readAll() {
      let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
      return transactions;
}

export function removeTransaction(id) {
      let transactions = readAll();
      transactions = transactions.filter(transaction => transaction.id !== id);
      localStorage.setItem("transactions", JSON.stringify(transactions));
}