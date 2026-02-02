import React from "react";
import TransactionContainer from "./TransactionContainer";
import FormContainer from "./FormContainer";

type MainContentProps = {
      transactions: Array<any>;
};

const MainContent = (props: MainContentProps) => {
      return (
            <div className="main-content">
                  <TransactionContainer transactions={props.transactions} />
                  <FormContainer />
            </div>
      );
};

export default MainContent;