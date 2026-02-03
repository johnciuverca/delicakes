import React, { useState } from "react";
import { TransactionList } from "./TransactionList";

interface TransactionContainerProps {
      transactions: any[];
}

const TransactionContainer = (props: TransactionContainerProps) => {
      const [sortCriteria, setSortCriteria] = useState("creationDate");

      const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            setSortCriteria(event.target.value);
      };

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
                              <select
                                    name="Sort by:"
                                    id="sort"
                                    value={sortCriteria}
                                    onChange={handleSortChange}
                              >
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

                  <TransactionList transactions={props.transactions} sortBy={sortCriteria} />
            </div >
      );
};

export default TransactionContainer;