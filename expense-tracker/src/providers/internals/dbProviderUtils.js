const remoteApiBaseUrl = 'http://192.168.0.118:3001';
const localApiBaseUrl = 'http://localhost:3100';
const apiBaseUrl = localApiBaseUrl;


export function fetchAllTransactions() {
      return fetch(`${apiBaseUrl}/api/transactions`)
            .then(response => {
                  if (!response.ok) {
                        throw new Error('Network response was not ok');
                  }
                  return response.json();
            });
}

export function insertTransaction(transactionInput) {
      return fetch(`${apiBaseUrl}/api/transactions`, {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionInput)
      }).then(response => {
            if (!response.ok) {
                  throw new Error('Network response was not ok');
            }
            return response.json();
      });
}

export function updateTransaction(inputId, properties) {
      return fetch(`${apiBaseUrl}/api/transactions/${inputId}`, {
            method: 'PUT',
            headers: {
                  'Content-Type': 'application/json'
            },
            body: JSON.stringify(properties)
      }).then(response => {
            if (!response.ok) {
                  throw new Error('Network response was not ok');
            }
            return response.json();
      });
}

export function deleteTransaction(inputId) {
      return fetch(`${apiBaseUrl}/api/transactions`, {
            method: 'DELETE',
            headers: {
                  'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                  id: inputId
            })
      }).then(response => {
            if (!response.ok) {
                  return false;
            }
            return true;
      });
}

