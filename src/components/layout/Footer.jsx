import React from "react";


const Footer = () => {

    const anoAtual = new Date().getFullYear();

    return(
            
        <div className="footer"> 
            <p>© {anoAtual} Orquidea. Todos os direitos reservados.</p>

        </div>
    );

}

export default Footer;