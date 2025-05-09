import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PaginaPesquisador from "./pages/PaginaPesquisador"; 
import PaginaPesquisaNome from "./pages/PaginaPesquisaNome"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pesquisaID" element={<PaginaPesquisador />} />
        <Route path="/pesquisa" element={<PaginaPesquisaNome />} />
      </Routes>
    </Router>
  );
}

export default App;
