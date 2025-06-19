import React from "react";

// Componente funcional Footer
const Footer = () => {

    // Obtém o ano atual usando o objeto Date do JavaScript
    const anoAtual = new Date().getFullYear();

    // Retorna o JSX do rodapé
    return(
        <div className="footer"> 
            {/* Exibe o ano atual e a mensagem de direitos reservados */}
            <p>© {anoAtual} Orquidea. Todos os direitos reservados.</p>
        </div>
    );
}

// Exporta o componente Footer para ser utilizado em outros arquivos
export default Footer;