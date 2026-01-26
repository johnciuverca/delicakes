import React from "react";
import TransactionContainer from "./TransactionContainer";
import FormContainer from "./FormContainer";

const MainContent = (props: { transactions: any }) => {
      return (
            <div className="main-content">
                  <TransactionContainer transactions={props.transactions} />
                  <FormContainer />
            </div>
      );
};

export default MainContent;