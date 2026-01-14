import React from "react";

const FormContainer = () => {
      return (
            <>
                  <h2>Add Transaction</h2>
                  <form id="transaction-form">
                        <div className="form-group">
                              <label htmlFor="description">Description</label>
                              <input type="text" id="description" placeholder="Enter description..." required />
                        </div>
                        <div className="form-group">
                              <label htmlFor="amount">Amount</label>
                              <input type="number" id="amount" placeholder="Enter amount..." required />
                              <small>Use negative (-) for expenses</small>
                        </div>
                        <div className="form-group">
                              <label htmlFor="record-date">Record Date</label>
                              <input type="date" id="record-date" required />
                        </div>
                        <button type="submit">Add Transaction</button>
                  </form>
            </>

      );
};

export default FormContainer;