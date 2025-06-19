// Importa a biblioteca React, necessária para criar componentes React
import React from "react";
// Importa o módulo ReactDOM para manipular a árvore de elementos no DOM
import ReactDOM from "react-dom/client";
// Importa o componente principal da aplicação
import App from "./App";
// Importa o arquivo de estilos CSS global
import "./styles.css";

// Cria a raiz da aplicação React no elemento com id "root" e renderiza o componente App
ReactDOM.createRoot(document.getElementById("root")).render(
  // Envolve o App em React.StrictMode para ajudar a identificar problemas no código
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
