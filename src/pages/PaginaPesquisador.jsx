import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";


/* aqui pode tá parecendo uma bagunça, mas é onde estamos chamando a API do orcid
pra pegar os dados do pesquisador. Logo abaixo dessa parte tem o HTML da página com os
dados extraídos */

const PaginaPesquisador = () => {

  const [dados, setDados] = useState(null);
  const [works, setWorks] = useState([]);

  const location = useLocation();
  const orcidID = new URLSearchParams(location.search).get("orcid");

  useEffect(() => {
    if (!orcidID) return;

    const fetchDados = async () => {
      try {
        const [recordRes, worksRes] = await Promise.all([
          fetch(`https://pub.orcid.org/v3.0/${orcidID}/record`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`https://pub.orcid.org/v3.0/${orcidID}/works`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        const recordData = await recordRes.json();
        const worksData = await worksRes.json();

        const worksList = worksData.group?.map((g) => {
          const summary = g["work-summary"]?.[0];

          return {
            title: summary?.title,
            year: summary?.["publication-date"]?.year?.value,
          };

        }) || [];

        const sortedWorks = worksList.sort((a, b) => (b.year || 0) - (a.year || 0));

        setDados(recordData);
        setWorks(sortedWorks);

      } catch (err) {
        console.error(err);
      }
    };

    fetchDados();

  }, [orcidID]); /* o effect é chamado toda vez que o orcidID muda */

  const totalPubs = works.length;
  const latest = works.slice(0, 4);

  return (
    <div>
      <Navbar />

      <section className="researchSection">
        <div className="researchCard">
          {dados ? (
            <div>
              <img></img>
              <p>
                {dados.person.name?.["given-names"]?.value}{" "}
                {dados.person.name?.["family-name"]?.value}
              </p>
              <p>
                <strong>ORCID ID:</strong> {orcidID}
              </p>
              <p>
                <strong>Total de publicações:</strong> {totalPubs}
              </p>

            </div>
          ) : (
            <p>Carregando dados do pesquisador...</p>
          )}
        </div>

        <div className="researchInfo">

          <h2>Últimos artigos publicados</h2>
          <ul>
            {latest.map((w, i) => (
              <li key={i}>
                {w.title?.title?.value} {w.year && `(${w.year})`}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />


    </div>
  );
};

export default PaginaPesquisador;
