import React from "react";
import TransactionContainer from "./TransactionContainer";
import FormContainer from "./FormContainer";

type MainContentProps = {
      transactions: Array<any>;
      refreshList: () => void;
};

const MainContent = (props: MainContentProps) => {
      return (
            <div className="main-content">
                  <TransactionContainer transactions={props.transactions} />
                  <FormContainer refreshList={props.refreshList} />
            </div>
      );
};

export default MainContent;