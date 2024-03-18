import React, { useState } from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const NavbarComp = ({ setFlag, flag }) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      setStatus(auth);
      setFlag(true);
    }
  }, [status]);

  const clearStorage = () => {
    localStorage.removeItem("user");
    setStatus(null);
    setFlag(false);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" data-bs-theme="dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img
            src="amann2.png"
            alt="logo"
            className="nav_img"
            width="35"
            height="28"
          />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {flag ? (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products">
                  Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/addaproduct">
                  Add Product
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  Profile
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/" onClick={clearStorage}>
                  Logout
                </NavLink>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/signup">
                  Sign Up
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarComp;
