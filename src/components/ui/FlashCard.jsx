import React from "react";

/* FlashCards na homepage que mostra o botão de ranking e comparação */
const FlashCard = ({ icon, title, text }) => (
  <div className="flashcard">
    <img alt="Icon" src={icon} />
    <h2>{title}</h2>
    <p>{text}</p>
  </div>
);

export default FlashCard;