import React from "react";
import { TransactionList } from "./TransactionList";

interface TransactionContainerProps {
      transactions: any[];
      onRemove: (id: string) => void;
}

const TransactionContainer = (props: TransactionContainerProps) => {
      return (
            <div className="transaction-container">
                  <div id="transaction-bar">
                        <h2>Transactions</h2>
                        <div>
                              <p>Filter</p>
                              <input id="filter"></input>
                        </div>

                        <div>
                              <p>sort by:</p>
                              <select name="Sort by:" id="sort">
                                    <option value="creationDate" selected>Default</option>
                                    <option value="recordDate">Newest</option>
                                    <option value="reverseRecordDate">Oldest</option>
                                    <option value="alphabetic">{"A -> Z"}</option>
                                    <option value="reverseAlphabetic">{"Z -> A"}</option>
                                    <option value="amount-desc">Amount Low To High</option>
                                    <option value="amount-asc">Amount High to Low</option>
                              </select>
                        </div>
                  </div>

                  <TransactionList transactions={props.transactions} onRemove={props.onRemove} />
            </div >
      );
};

export default TransactionContainer;