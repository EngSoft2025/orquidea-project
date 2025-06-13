import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PaginaPesquisador from "./pages/PaginaPesquisador"; 
import PaginaPesquisaNome from "./pages/PaginaPesquisaNome"; 
import CompararPesquisador from "./pages/CompararPesquisador"; 
import ArtigosEmAlta from "./pages/ArtigosEmAlta"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pesquisaID" element={<PaginaPesquisador />} />
        <Route path="/pesquisa" element={<PaginaPesquisaNome />} />
        <Route path="/comparar" element={<CompararPesquisador />} />
        <Route path="/artigos-em-alta" element={<ArtigosEmAlta />} />
      </Routes>
    </Router>
  );
}

export default App;
