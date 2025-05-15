import React from "react";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/ui/SearchBar";
import cards from "../../public/cards";
import FlashCard from "../components/ui/FlashCard";

const Index = () => (
  <div>
    <section className="section_search">
      <div className="logo-pos">
        <img
          src="/logo.png"
          alt="Logo"
          className="logo_img"
        />
        <span className="texto_orquidea">Orquidea</span>
      </div>

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

export default Index;