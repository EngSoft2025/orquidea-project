import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../ui/SearchBar";

const Navbar = ({ showSearchBar = false, extraClass = "" }) => (
  <div className={`navbar ${extraClass}`}>
    <Link
      to="/"
      style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
    >
      <img className="logo_img" src="/logo.png" alt="Logo" />
      <span className="texto_orquidea">Orquidea</span>
    </Link>

    {showSearchBar && <SearchBar />}
  </div>
);

export default Navbar;