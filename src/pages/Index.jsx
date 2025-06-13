import React, { useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/ui/SearchBar";
import cards from "../../public/cards";
import FlashCard from "../components/ui/FlashCard";
import Typed from "typed.js";

const Index = () => {
  const el = useRef(null);
  const typed = useRef(null);

  useEffect(() => {
    typed.current = new Typed(el.current, {
      strings: ["pesquisa", "publica", "ensina", "inova", "transforma", "inspira", "descobre", "orienta"],
      typeSpeed: 170,
      backSpeed: 170,
      loop: true,
    });

    return () => typed.current.destroy();
  }, []);

  return (
    <div className="pageWrapper">
      <section className="section_search">
        <div className="logo-pos">
          <img src="/logo.png" alt="Logo" className="logo_img" />
          <span className="texto_orquidea">Orquidea</span>
        </div>

        <div className="typed-text-container">
          <span ref={el} className="typed-text"></span>
        </div>

        <SearchBar />
      </section>

      <section className="section_comp">
        {cards.map((card, i) => (
          <FlashCard key={i} icon={card.icon} title={card.title} text={card.text} />
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default Index;