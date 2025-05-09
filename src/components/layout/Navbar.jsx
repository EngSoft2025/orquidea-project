import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <div className="navbar">
    <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
      <img className="logo_img" src="../../../public/logo.png" alt="Logo" />
      <span className="logo" style={{color: "black"}}>Orquidea</span>
    </Link>
  </div>
);

export default Navbar;
