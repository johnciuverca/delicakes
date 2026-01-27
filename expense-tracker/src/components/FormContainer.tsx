import React, { useState } from "react";
import type { TransactionUI } from "../model/types";
import { dataProvider } from "../providers/dataProvider";

type FormContainerProps = {
      refreshList: () => void;
};

const FormContainer = (props: FormContainerProps) => {
      const [description, setDescription] = useState("");
      const [amount, setAmount] = useState("");
      const [recordDate, setRecordDate] = useState("");

      return (
            <div className="form-container">
                  <h2>Add Transaction</h2>
                  <form id="transaction-form" onSubmit={e => {
                        e.preventDefault();

                        const newTransactionUI: TransactionUI = {
                              description: description,
                              amount: parseFloat(amount),
                              recordDate: recordDate
                        };

                        dataProvider.insert(newTransactionUI).then(() => {
                              props.refreshList();
                        });
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
                        <button type="submit">Add Transaction</button>
                  </form>
            </div >
      );
};

export default FormContainer;