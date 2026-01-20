import React from "react";
import TransactionContainer from "./TransactionContainer";
import FormContainer from "./FormContainer";

const MainContent = () => {
      return (
            <div className="main-content">
                  <TransactionContainer />
                  <FormContainer />
            </div>
      );
};


export default MainContent;