import React from "react";

const FlashCard = (props) => {

    return(

        <div className="flashcard">
            <img alt="Icon" src={props.icon}></img>
            <h2>{props.title}</h2>
            <p>{props.text}</p>
        </div>
    );



}

export default FlashCard;