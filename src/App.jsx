// Importa o React para utilizar JSX e componentes
import React from "react";
// Importa componentes de roteamento do React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importa as páginas que serão exibidas conforme a rota
import Index from "./pages/Index";
import PaginaPesquisador from "./pages/PaginaPesquisador"; 
import PaginaPesquisaNome from "./pages/PaginaPesquisaNome"; 
import CompararPesquisador from "./pages/CompararPesquisador"; 
import ArtigosEmAlta from "./pages/ArtigosEmAlta"; 

// Componente principal da aplicação
function App() {
  return (
    // Envolve toda a aplicação com o Router para habilitar o roteamento
    <Router>
      {/* Define as rotas da aplicação */}
      <Routes>
        {/* Rota para a página inicial */}
        <Route path="/" element={<Index />} />
        {/* Rota para pesquisa por ID do pesquisador */}
        <Route path="/pesquisaID" element={<PaginaPesquisador />} />
        {/* Rota para pesquisa por nome */}
        <Route path="/pesquisa" element={<PaginaPesquisaNome />} />
        {/* Rota para comparar pesquisadores */}
        <Route path="/comparar" element={<CompararPesquisador />} />
        {/* Rota para exibir artigos em alta */}
        <Route path="/artigos-em-alta" element={<ArtigosEmAlta />} />
      </Routes>
    </Router>
  );
}

// Exporta o componente App para ser utilizado em outros arquivos
export default App;
