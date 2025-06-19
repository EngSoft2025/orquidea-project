import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Componente SearchBar para busca de pesquisadores por nome ou ORCID
const SearchBar = () => {
  // Estado para armazenar o valor digitado no input
  const [inputValue, setInput] = useState("");
  // Hook do React Router para navegação programática
  const navigate = useNavigate();

  // Função chamada ao submeter o formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita o recarregamento da página

    // Expressão regular para verificar se o valor é um ORCID válido (4 blocos de 4 dígitos)
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;

    if (orcidRegex.test(inputValue)) {
      // Se for ORCID, redireciona para a página de pesquisa por ID
      navigate(`/pesquisaID?orcid=${inputValue}`);
    } else {
      // Se não for ORCID, redireciona para a página de pesquisa por nome
      navigate(`/pesquisa?nome=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    // Formulário de busca
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Digite o nome ou ORCID do pesquisador"
        className="searchbar"
        // Atualiza o estado com o valor digitado
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="button_search">
        Buscar
      </button>
    </form>
  );
};

export default SearchBar;