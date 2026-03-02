import React from "react";
import TransactionContainer from "./TransactionContainer";
import FormContainer from "./FormContainer";

type MainContentProps = {
};

const MainContent = (props: MainContentProps) => {
      return (
            <div className="main-content">
                  <TransactionContainer />
                  <FormContainer />
            </div>
      );
};

export default MainContent;