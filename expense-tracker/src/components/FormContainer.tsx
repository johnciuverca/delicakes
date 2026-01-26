import React, { useState } from "react";

const FormContainer = () => {
      const [description, setDescription] = useState("");
      const [amount, setAmount] = useState("");
      const [recordDate, setRecordDate] = useState("");

      return (
            <div className="form-container">
                  <h2>Add Transaction</h2>
                  <form id="transaction-form" onSubmit={e => {
                        e.preventDefault();
                        console.log("description: ", description);
                        console.log("amount: ", amount);
                        console.log("record-date: ", recordDate);
                  }}>
                        <div className="form-group">
                              <label htmlFor="description">Description</label>
                              <input
                                    required
                                    type="text"
                                    id="description"
                                    placeholder="Enter description..."
                                    onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="form-group">
                              <label htmlFor="amount">Amount</label>
                              <input
                                    required
                                    type="number"
                                    id="amount"
                                    placeholder="Enter amount..."
                                    onChange={e => setAmount(e.target.value)} />
                              <small>Use negative (-) for expenses</small>
                        </div>
                        <div className="form-group">
                              <label htmlFor="record-date">Record Date</label>
                              <input
                                    required
                                    type="date"
                                    id="record-date"
                                    onChange={e => setRecordDate(e.target.value)} />
                        </div>
                        <button type="submit"
                        >Add Transaction</button>
                  </form>
            </div >
      );
};

export default FormContainer;