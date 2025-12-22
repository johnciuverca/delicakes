import React from "react";

class MainContainer extends React.Component<
      {},
      {
            count: number;
            items: any[];
      }
> {
      constructor(props: {}) {
            super(props);
            this.state = {
                  // Define your state properties here
                  count: 0,
                  items: [],
            };
      }

      componentDidMount() {
            // This code runs after the component mounts
            console.log("Component mounted!");
            // Call your function here
      }

      render() {
            return (
                  <div className="main-container">
                        <button onClick={(e: any) => {
                              e.preventDefault();
                              this.setState({ count: this.state.count + 1 });
                        }}>
                              Click me!
                        </button>
                        <div>Count is: {this.state.count}</div>
                  </div>
            );
      }
}

export default MainContainer;