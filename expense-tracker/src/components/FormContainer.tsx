import React, { useCallback, useState } from "react";
import type { TransactionUI } from "../model/types";
import { dataProvider } from "../providers/dataProvider";
import { useRefreshList } from "./MainContainer";

type FormContainerProps = {
};

const FormContainer = (props: FormContainerProps) => {
      const [description, setDescription] = useState("");
      const [amount, setAmount] = useState("");
      const [recordDate, setRecordDate] = useState(getCurrentDateISO());
      const refreshListCallback = useRefreshList();

      const resetState = useCallback(() => {
            setDescription("");
            setAmount("");
            setRecordDate(getCurrentDateISO());
            console.log("Form state has been reset.");
      }, []);

      return (
            <div className="form-container">
                  <h2>Add Transaction</h2>
                  <form id="transaction-form" onSubmit={e => {
                        e.preventDefault();

                        const newTransactionUI: TransactionUI = {
                              description: description,
                              amount: parseFloat(amount),
                              recordDate: formatDateToDDMMYYYY(recordDate)
                        };

                        dataProvider.insert(newTransactionUI).then((result) => {
                              refreshListCallback();
                              resetState();
                        });
                  }}>
                        <div className="form-group">
                              <label htmlFor="description">Description</label>
                              <input
                                    required
                                    value={description}
                                    type="text"
                                    id="description"
                                    placeholder="Enter description..."
                                    onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="form-group">
                              <label htmlFor="amount">Amount</label>
                              <input
                                    required
                                    value={amount}
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
                                    value={recordDate}
                                    onChange={e => setRecordDate(e.target.value)} />
                        </div>
                        <button type="submit">Add Transaction</button>
                  </form>
            </div >
      );
};

function getCurrentDateISO(): string {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
}

function formatDateToDDMMYYYY(isoDate: string): string {
      const [year, month, day] = isoDate.split("-");
      return `${day}-${month}-${year}`;
}

export default FormContainer;