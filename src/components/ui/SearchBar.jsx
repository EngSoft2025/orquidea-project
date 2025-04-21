import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {

    const [inputValue, setInput] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {

        // Previne que a página recarregue quando
        //  mandar o forms
        e.preventDefault();
        
        // Manda o usuário pra página do pesquisador com o orcid do input
        navigate(`/pesquisador?orcid=${inputValue}`);
    }

    return (
        
    <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o ORCID ID do pesquisador (só funfa com o ID)"
          className="searchbar"
          onChange={(e) => setInput(e.target.value)} // Pega o que o usuário digitou e bota dentro do inputValue
        />
        <button type="submit" className="button_search">
          Buscar
        </button>
      </form>

    );
}

export default SearchBar;