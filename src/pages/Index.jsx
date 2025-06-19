// Importa as dependências necessárias do React e outros componentes do projeto
import React, { useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/ui/SearchBar";
import FlashCard from "../components/ui/FlashCard";
import { Link } from "react-router-dom";
import Typed from "typed.js";

// Componente principal da página inicial
const Index = () => {
  // Cria referências para manipular elementos DOM e instância do Typed.js
  const el = useRef(null);
  const typed = useRef(null);

  // Efeito para inicializar o Typed.js ao montar o componente
  useEffect(() => {
    // Inicializa o efeito de digitação animada com palavras-chave
    typed.current = new Typed(el.current, {
      strings: ["pesquisa", "publica", "ensina", "inova", "transforma", "inspira", "descobre", "orienta"],
      typeSpeed: 170,
      backSpeed: 170,
      loop: true,
    });

    // Limpa o efeito ao desmontar o componente
    return () => typed.current.destroy();
  }, []);

  // Renderiza a estrutura da página
  return (
    <div className="pageWrapper">
      {/* Seção de busca com logo, texto animado e barra de pesquisa */}
      <section className="section_search">
        <div className="logo-pos">
          <img src="/logo.png" alt="Logo" className="logo_img" />
          <span className="texto_orquidea">Orquidea</span>
        </div>

        <div className="typed-text-container">
          {/* Elemento onde o texto animado será exibido */}
          <span ref={el} className="typed-text"></span>
        </div>

        {/* Barra de pesquisa */}
        <SearchBar />
      </section>

      {/* Seção de cards com links para outras funcionalidades */}
      <section className="section_comp">
        <Link to="/artigos-em-alta" className="card-link">
          <FlashCard
            icon="/graph.png"
            title="Artigos em Alta"
            text="Explore os artigos mais citados nos últimos 3 anos."
          />
        </Link>
        <Link to="/comparar" className="card-link">
          <FlashCard
            icon="/people.png"
            title="Comparar Pesquisadores"
            text="Compare métricas e publicações de pesquisadores."
          />
        </Link>
      </section>

      {/* Rodapé da página */}
      <Footer />
    </div>
  );
};

export default Index;