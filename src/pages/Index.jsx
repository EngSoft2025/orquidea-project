import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/ui/SearchBar";
import cards from "../../public/cards";
import FlashCard from "../components/ui/FlashCard";



const Index = () => {
  return (
    <div>
      <Navbar />
      
      <section className="section_search">
        <div className="titulo">
          <h1 style={{fontSize: "36px", fontWeight:"bold"}}>Pesquisa o mestre ai...</h1>
          <p>Aqui vc basicamente pesquisa o ORCID de quem vc quiser e recebe as
            informações de um jeito mais legal. </p>
        </div>
        <SearchBar/>
      </section>

      <section className="section_comp">

        {cards.map((card, index) => {
            return(<FlashCard
              key={index}
              icon={card.icon}
              title={card.title}
              text={card.text}
            />);
        })}

      </section>
      
      <Footer />

    </div>
  );
}

export default Index;
