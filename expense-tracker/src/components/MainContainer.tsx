import React from "react";
import NavBar from "./NavBar";
import BalanceContainer from "./BalanceContainer";
import type { Transaction } from "../model/types";
import { dataProvider } from "../providers/dataProvider";
import NewComponent from "./NewComponent";

class MainContainer extends React.Component<
      {},
      {
            count: number;
            transactions: Transaction[];
      }
> {
      constructor(props: {}) {
            super(props);
            this.state = {
                  // Define your state properties here
                  count: 0,
                  transactions: [],
            };
      }

      componentDidMount() {
            // This code runs after the component mounts
            console.log("Component mounted!");
            // Call your function here

            dataProvider.readAll().then((records: Transaction[]) => {
                  this.setState({ transactions: records });
            });
      }

      render() {
            return (
                  <div className="container">
                        <NavBar />
                        <BalanceContainer transactions={this.state.transactions} />
                        <button onClick={(e: any) => {
                              e.preventDefault();
                              this.setState({ count: this.state.count + 1 });
                        }}>
                              Click me!
                        </button>
                        <div>Count is: {this.state.count}</div>
                        <NewComponent />
                  </div>
            );
      }
}

export default MainContainer;