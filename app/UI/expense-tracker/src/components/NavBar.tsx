import React from "react";

type NavBarProps = {};

const NavBar: React.FC<NavBarProps> = () => {
      return (
            <nav className="navbar">
                  <div className="left-links">
                        <a href="/">Delicakes.com</a>
                  </div>
                  <h1>Delicakes Expense Tracker</h1>
                  <div className="right-links">
                        <a href="#" id="logout-btn">Logout</a>
                  </div>
            </nav>
      );
};

export default NavBar;