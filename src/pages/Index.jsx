import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/ui/SearchBar";
import cards from "../../public/cards";
import FlashCard from "../components/ui/FlashCard";

const Index = () => {
  const el = useRef(null); // referência ao span
  const typed = useRef(null); // referência ao objeto Typed

  useEffect(() => {
    typed.current = new Typed(el.current, {
      strings: ["pesquisa", "publica", "ensina", "inova", "transforma", "inspira", "descobre", "orienta"],
      typeSpeed: 170,
      backSpeed: 170,
      loop: true,
    });

    return () => {
      // destruir o objeto quando o componente desmontar
      typed.current.destroy();
    };
  }, []);

  return (
    <div>
      <section className="section_search">
        <div className="logo-pos">
        <img src="public/logo.png" alt="Logo" className="logo_img" />
        <span className="texto_orquidea">Orquidea</span>
        </div>

    
        <h1 className="titulo">
          Explore quem <span className="auto-type" ref={el}></span>
        </h1>

        <SearchBar />
      </section>

      <section className="section_comp">
        {cards.map((card, index) => (
          <FlashCard
            key={index}
            icon={card.icon}
            title={card.title}
            text={card.text}
          />
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
