// Importa o React para poder usar JSX e componentes funcionais
import React from "react";

// Define o componente funcional FlashCard que recebe as props: icon, title e text
const FlashCard = ({ icon, title, text }) => (
  // Cria uma div com a classe 'flashcard'
  <div className="flashcard">
    {/* Exibe a imagem do ícone passado pela prop 'icon' */}
    <img alt="Icon" src={icon} />
    {/* Exibe o título passado pela prop 'title' */}
    <h2>{title}</h2>
    {/* Exibe o texto passado pela prop 'text' */}
    <p>{text}</p>
  </div>
);
export default FlashCard;