import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Componente principal da página do pesquisador
const PaginaPesquisador = () => {
  // Estados para armazenar dados do pesquisador, trabalhos, instituições e status de cópia do ORCID
  const [dados, setDados] = useState(null);
  const [works, setWorks] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [isCopied, setIsCopied] = useState(false);

  // Hook para acessar a URL e extrair o parâmetro ORCID
  const location = useLocation();
  const orcidID = new URLSearchParams(location.search).get("orcid");

  // Refs para manipular altura dos cards lateralmente
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);

  // Função para copiar o ORCID para a área de transferência
  const handleCopyOrcid = () => {
    if (!orcidID) return;
    navigator.clipboard.writeText(orcidID).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error("Falha ao copiar o ORCID ID: ", err);
      }
    );
  };

  // Efeito para buscar dados do pesquisador e suas publicações ao carregar a página ou mudar o ORCID
  useEffect(() => {
    if (!orcidID) return;
    (async () => {
      try {
        // Busca os dados do pesquisador e suas publicações em paralelo
        const [rec, wrk] = await Promise.all([
          fetch(`https://pub.orcid.org/v3.0/${orcidID}/record`, {
            headers: { Accept: "application/json" },
          }).then((r) => r.json()),
          fetch(`https://pub.orcid.org/v3.0/${orcidID}/works`, {
            headers: { Accept: "application/json" },
          }).then((r) => r.json()),
        ]);
        setDados(rec);

        // Processa e ordena as publicações por ano
        const lista = wrk.group?.map((g) => {
          const s = g["work-summary"]?.[0];
          const url = s["external-ids"]?.["external-id"]?.find(e => e["external-id-type"] === "doi")?.["external-id-url"]?.value;
          return {
            title: s?.title?.title?.value,
            year: s?.["publication-date"]?.year?.value,
            url,
          };
        }) || [];
        setWorks(lista.sort((a, b) => (b.year || 0) - (a.year || 0)));

        // Busca e formata as instituições do pesquisador
        const detailedAffiliations = rec?.["activities-summary"]?.employments?.["employment-summary"];
        if (detailedAffiliations && detailedAffiliations.length > 0) {
          const formatted = detailedAffiliations.map(item => ({
            name: item.organization.name,
            date: `${item["start-date"]?.year?.value || ""} - ${item["end-date"]?.year?.value || "Presente"}`
          }));
          setInstitutions(formatted);
        } else {
          // Busca alternativa caso não haja afiliações detalhadas
          const searchRes = await fetch(`https://pub.orcid.org/v3.0/expanded-search/?q=orcid:${orcidID}`, {
            headers: { Accept: "application/json" }
          });
          const searchData = await searchRes.json();
          const institutionNames = searchData?.["expanded-result"]?.[0]?.["institution-name"];
          if (institutionNames && institutionNames.length > 0) {
            const formatted = institutionNames.map(name => ({ name: name, date: null }));
            setInstitutions(formatted);
          }
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [orcidID]);

  // Efeito para igualar a altura dos cards laterais
  useLayoutEffect(() => {
    const setCardsHeight = () => {
      if (leftCardRef.current && rightCardRef.current) {
        rightCardRef.current.style.height = 'auto';
        requestAnimationFrame(() => {
          if (leftCardRef.current && rightCardRef.current) {
            const leftHeight = leftCardRef.current.offsetHeight;
            rightCardRef.current.style.height = `${leftHeight}px`;
          }
        });
      }
    };
    setCardsHeight();
    window.addEventListener('resize', setCardsHeight);
    return () => {
      window.removeEventListener('resize', setCardsHeight);
    };
  }, [dados, works, institutions]);

  // Renderização da página
  return (
    <div className="page-container">
      <Navbar showSearchBar extraClass="navbar-pesquisador" />
      <section className="researchSection">
        {/* Card com informações principais do pesquisador */}
        <div className="researchCard" ref={leftCardRef}>
          {dados ? (
            <>
              <img src="/user-research.png" alt="avatar" />
              <p className="researchName">
                {`${dados.person.name["given-names"].value} ${dados.person.name["family-name"].value}`}
              </p>
              <div className="orcid-container">
                <p><strong>ORCID ID:</strong> {orcidID}</p>
                <button onClick={handleCopyOrcid} className="copy-button" title="Copiar ORCID ID">
                  <img src="/clipb.png" alt="Copiar" />
                </button>
                {isCopied && <span className="copy-feedback">✔</span>}
              </div>
              <p><strong>Total de publicações:</strong> {works.length}</p>
              {/* Exibe palavras-chave do pesquisador */}
              {dados.person.keywords?.keyword?.length > 0 && (
                <div className="keywords-container">
                  {dados.person.keywords.keyword.map((kw, i) => (
                    <Link key={i} to={`/artigos-em-alta?keyword=${encodeURIComponent(kw.content)}`} className="keyword-box">
                      {kw.content}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p>Carregando dados…</p>
          )}
        </div>

        {/* Card com lista dos últimos artigos publicados */}
        <div className="researchInfo" ref={rightCardRef}>
          <h2>Últimos artigos publicados</h2>
          <ul>
            {works.slice(0, 10).map((w, i) => (
              <li key={i}>
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="link-artigo">
                  {w.title} {w.year && `(${w.year})`}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Card com lista de instituições do pesquisador */}
        {institutions.length > 0 && (
          <div className="institutionsCard">
            <h2>Instituições</h2>
            <ul>
              {institutions.map((item, index) => (
                <li key={index}>
                  <p className="institution-name">{item.name}</p>
                  {item.date && <p className="institution-date">{item.date}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default PaginaPesquisador;