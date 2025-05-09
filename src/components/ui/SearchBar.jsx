import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [inputValue, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifica se é um ORCID (formato com 4 blocos de 4 dígitos)
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;

    if (orcidRegex.test(inputValue)) {
      // Se for ORCID, vai direto pra página do pesquisador
      navigate(`/pesquisaID?orcid=${inputValue}`);
    } else {
      // Se não for ORCID, faz uma busca por nome
      navigate(`/pesquisa?nome=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Digite o nome ou ORCID do pesquisador"
        className="searchbar"
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="button_search">
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;