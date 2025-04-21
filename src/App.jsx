import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PaginaPesquisador from "./pages/PaginaPesquisador"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/pesquisador" element={<PaginaPesquisador />} />
      </Routes>
    </Router>
  );
}

export default App;
