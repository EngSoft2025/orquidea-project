import React from "react";

const FlashCard = ({ icon, title, text }) => (
  <div className="flashcard">
    <img alt="Icon" src={icon} />
    <h2>{title}</h2>
    <p>{text}</p>
  </div>
);

export default FlashCard;