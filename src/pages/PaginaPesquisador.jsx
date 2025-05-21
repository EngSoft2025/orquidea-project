import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SearchBar from "../components/ui/SearchBar";

const PaginaPesquisador = () => {
  const [dados, setDados] = useState(null);
  const [works, setWorks] = useState([]);
  const location = useLocation();
  const orcidID = new URLSearchParams(location.search).get("orcid");

  useEffect(() => {
    if (!orcidID) return;

    (async () => {
      try {
        const [rec, wrk] = await Promise.all([
          fetch(`https://pub.orcid.org/v3.0/${orcidID}/record`, {
            headers: { Accept: "application/json" },
          }).then(r => r.json()),
          fetch(`https://pub.orcid.org/v3.0/${orcidID}/works`, {
            headers: { Accept: "application/json" },
          }).then(r => r.json()),
        ]);

        const name = rec.person.name;
        // setDados({
        //   fullName: `${name["given-names"]?.value} ${name["family-name"]?.value}`,
        // });
        setDados(rec);

        const lista =
          wrk.group?.map(g => {
            const s = g["work-summary"]?.[0];
            return {
              title: s?.title?.title?.value,
              year: s?.["publication-date"]?.year?.value,
            };
          }) || [];
        setWorks(
          lista.sort((a, b) => (b.year || 0) - (a.year || 0))
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, [orcidID]);

  return (
    <div>
      <Navbar showSearchBar extraClass="navbar-pesquisador" />

      <section className="researchSection">
        <div className="researchCard">
          {dados ? (
            <>
              <img src="/user-research.png" alt="avatar" />
              <p className="researchName">
                {`${dados.person.name["given-names"].value} ${dados.person.name["family-name"].value}`}
              </p>
              <p>
                <strong>ORCID ID:</strong> {orcidID}
              </p>
              <p>
                <strong>Total de publicações:</strong> {works.length}
              </p>
              {dados.person.keywords?.keyword?.length > 0 && (
                <div className="keywords-container">
                  {dados.person.keywords.keyword.map((kw, i) => (
                    <span key={i} className="keyword-box">{kw.content}</span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>Carregando dados…</p>
          )}
        </div>

        <div className="researchInfo">
          <h2>Últimos artigos publicados</h2>
          <ul>
            {works.slice(0, 4).map((w, i) => (
              <li key={i}>
                {w.title} {w.year && `(${w.year})`}
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

