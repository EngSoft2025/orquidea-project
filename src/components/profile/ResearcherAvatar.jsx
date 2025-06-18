import React from "react";


/* Iniciais do pesquisador na foto de perfil */
const ResearcherAvatar = ({ firstName = "", lastName = "" }) => {
    const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  
    return (
      <div className="avatar">
        <span>{initials}</span>
      </div>
    );
  };
  


export default ResearcherAvatar;