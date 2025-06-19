import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../ui/SearchBar";

// Componente funcional Navbar, recebe as props showSearchBar e extraClass
const Navbar = ({ showSearchBar = false, extraClass = "" }) => (
  // Div principal da navbar, recebe classes extras se passadas por props
  <div className={`navbar ${extraClass}`}>
    {/* Link para a página inicial, estilizado para alinhar logo e texto */}
    <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
      {/* Imagem do logo */}
      <img className="logo_img" src="/logo.png" alt="Logo" />
      {/* Texto ao lado do logo */}
      <span className="texto_orquidea">Orquidea</span>
    </Link>

    {/* Renderiza a barra de busca apenas se showSearchBar for true */}
    {showSearchBar && <SearchBar />}
  </div>
);

// Exporta o componente Navbar para ser usado em outros arquivos
export default Navbar;