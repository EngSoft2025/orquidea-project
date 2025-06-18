import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";  
import Marquee from "react-fast-marquee";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const palavrasQuentes = [
  "Artificial Intelligence", "Climate Change", "Quantum Computing", "CRISPR", "Sustainability",
  "Renewable Energy", "Neural Networks", "Cybersecurity", "Smart Cities", "Data Privacy",
  "Bioinformatics", "Deep Learning", "5G Technology", "Space Exploration", "Autonomous Vehicles"
];

const ArtigosEmAlta = () => {
  const [input, setInput] = useState("");
  const [artigos, setArtigos] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const hasKeyword = params.get("keyword") != null;
  const [modoBusca, setModoBusca] = useState(!hasKeyword);
  const [totalArtigos, setTotalArtigos] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kw = params.get("keyword");
    if (kw) {
      setInput(kw);
      buscarArtigos(kw);
    }
  }, [location.search]);


  const buscarArtigos = async (keyword = input) => {
    setLoading(true);
    setErro(null);
    setArtigos([]);
    setPaginaAtual(1)
    try {
      const anoAtual = new Date().getFullYear();
      const anos = [anoAtual, anoAtual - 1, anoAtual - 2];

      const dataInicio = new Date();
      dataInicio.setFullYear(dataInicio.getFullYear() - 3);
      const dataInicioStr = dataInicio.toISOString().split("T")[0];

      // busca conceito, mas não aborta se não achar
    const conceptRes = await fetch(
      `https://api.openalex.org/concepts?search=${encodeURIComponent(keyword)}&per_page=1`
    );
    const conceptData = await conceptRes.json();

    // monta URLs de fetch com fallback
    let worksUrl;
    let countUrl;
    if (conceptData.results && conceptData.results.length > 0) {
        const conceptId = conceptData.results[0].id;
        worksUrl = `https://api.openalex.org/works?filter=concepts.id:${conceptId},from_publication_date:${dataInicioStr}&per_page=10&page=1&sort=cited_by_count:desc`;
        countUrl = `https://api.openalex.org/works?filter=concepts.id:${conceptId},from_publication_date:${dataInicioStr}`;
      } else {
        worksUrl = `https://api.openalex.org/works?search=${encodeURIComponent(keyword)}&filter=from_publication_date:${dataInicioStr}&per_page=10&page=1&sort=cited_by_count:desc`;
        countUrl = `https://api.openalex.org/works?search=${encodeURIComponent(keyword)}&filter=from_publication_date:${dataInicioStr}`;
      }

    // executa ambos os fetches
    const worksRes = await fetch(worksUrl);
    const worksData = await worksRes.json();

    const countRes = await fetch(countUrl);
    const countData = await countRes.json();

      const works = worksData.results.map((w) => {
        const counts = Object.fromEntries((w.counts_by_year || []).map(c => [c.year, c.cited_by_count]));
        const citacoes3anos = anos.reduce((acc, y) => acc + (counts[y] || 0), 0);
        const venue = w.primary_location?.source?.display_name || w.host_venue?.display_name || "Desconhecido";
        const fieldCitationRatio = w?.metrics?.field_citation_ratio ?? "N/A";
        const meanCitedness = w?.metrics?.["2yr_mean_citedness"] ?? "N/A";

        return {
          ...w,
          citacoes3anos,
          venue,
          fieldCitationRatio,
          meanCitedness,
          url:
            w.primary_location?.url ||
            (w.ids?.doi ? `https://doi.org/${w.ids.doi}` : w.id),
        };
      });

      const ordenados = works.sort((a, b) => b.citacoes3anos - a.citacoes3anos);
      setArtigos(ordenados);
      setTotalArtigos(countData.meta?.count ?? 0);
      
      setModoBusca(false);
    } catch (e) {
      console.error(e);
      setErro("Erro ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerMais = async () => {
    if (loadingMore || artigos.length >= totalArtigos) return;

    setLoadingMore(true);
    setErro(null);
    const nextPage = paginaAtual + 1;

    try {
      const dataInicio = new Date();
      dataInicio.setFullYear(dataInicio.getFullYear() - 3);
      const dataInicioStr = dataInicio.toISOString().split("T")[0];

      // A lógica para montar a URL é a mesma, apenas muda a página
      const conceptRes = await fetch(
        `https://api.openalex.org/concepts?search=${encodeURIComponent(input)}&per_page=1`
      );
      const conceptData = await conceptRes.json();

      let worksUrl;
      if (conceptData.results && conceptData.results.length > 0) {
        const conceptId = conceptData.results[0].id;
        worksUrl = `https://api.openalex.org/works?filter=concepts.id:${conceptId},from_publication_date:${dataInicioStr}&per_page=10&page=${nextPage}&sort=cited_by_count:desc`;
      } else {
        worksUrl = `https://api.openalex.org/works?search=${encodeURIComponent(input)}&filter=from_publication_date:${dataInicioStr}&per_page=10&page=${nextPage}&sort=cited_by_count:desc`;
      }

      const worksRes = await fetch(worksUrl);
      const worksData = await worksRes.json();

      const anoAtual = new Date().getFullYear();
      const anos = [anoAtual, anoAtual - 1, anoAtual - 2];
      const newWorks = worksData.results.map((w) => {
        const counts = Object.fromEntries((w.counts_by_year || []).map(c => [c.year, c.cited_by_count]));
        const citacoes3anos = anos.reduce((acc, y) => acc + (counts[y] || 0), 0);
        const venue = w.primary_location?.source?.display_name || w.host_venue?.display_name || "Desconhecido";
        return {
          ...w, citacoes3anos, venue,
          url: w.primary_location?.url || (w.ids?.doi ? `https://doi.org/${w.ids.doi}` : w.id),
        };
      });

      // Adiciona os novos artigos aos já existentes
      setArtigos(prevArtigos => [...prevArtigos, ...newWorks]);
      setPaginaAtual(nextPage);

    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar mais artigos.");
    } finally {
      setLoadingMore(false);
    }
  };
  return (
    <div className="page-container">
      <Navbar showSearchBar extraClass="navbar-pesquisador" />

      {modoBusca ? (
        <div className="busca-container">
          <div className="titulo-com-icone">
            <h2 className="titulo-gradiente">Artigos em alta</h2>
          </div>

          <span className="subtitulo-explicativo">
            Veja os artigos mais citados nos últimos 3 anos relacionados ao tema pesquisado.
          </span>

          <form className="busca-form" onSubmit={(e) => {
            e.preventDefault();
            buscarArtigos();
          }}>
            <input
              type="text"
              placeholder="Digite o nome da palavra-chave"
              className="searchbar searchbar-grande"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="button_search">
              Buscar
            </button>
          </form>

          <div className="carrossel-wrapper">
            <div className="carrossel-container">
              <div className="carrossel-fade-mask">
                <Marquee pauseOnHover speed={40}>
                  {palavrasQuentes.map((kw, index) => (
                    <button
                      key={index}
                      className="keyword-box"
                      onClick={() => {
                        setInput(kw);
                        buscarArtigos(kw);
                      }}
                    >
                      {kw}
                    </button>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="compareSection">
          <div className="searchResults">
            {erro && <p className="erro">{erro}</p>}
            {loading && <p className="carregando">Carregando...</p>}
            {artigos.length > 0 && (
              <>
                <div className="voltar-container">
                  <button
                    onClick={() => {
                      setModoBusca(true);
                      setArtigos([]);
                      setErro(null);
                      setInput("");
                    }}
                    className="submit-button"
                  >
                    Voltar para pesquisa
                  </button>
                </div>

                <h2 className="titulo-resultados">
                  <span className="h2-res">Top Artigos: </span>
                  <span className="h2-result">{input}</span>
                </h2>

                <p style={{ fontWeight: 500, marginTop: "1rem" }}>
                  Encontramos <b>{totalArtigos.toLocaleString()}</b> artigos com esse tema nos últimos 3 anos.
                </p>

                <div className="table-wrapper">
                  <table className="tabela-resultados tabela-animada">
                    <thead>
                      <tr>
                        <th><span>#</span></th>
                        <th><span>Título</span></th>
                        <th><span>Publicado em</span></th>
                        <th><span>Ano</span></th>
                        <th><span>Citações (3 anos)</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {artigos.map((a, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <a
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-artigo"
                            >
                              {a.display_name}
                            </a>
                          </td>
                          <td>{a.venue}</td>
                          <td>{a.publication_year}</td>
                          <td>{a.citacoes3anos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {artigos.length > 0 && artigos.length < totalArtigos && (
                  <div className="ver-mais-container">
                    <button
                      onClick={handleVerMais}
                      className="ver-mais-btn"
                      disabled={loadingMore}
                    >
                      {loadingMore ? "Carregando..." : "Ver mais resultados"}
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ArtigosEmAlta;