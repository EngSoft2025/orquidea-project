import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Componente principal da página de pesquisa por nome
const PaginaPesquisaNome = () => {
  // Estados para armazenar resultados, página atual, carregamento e filtro avançado
  const [resultados, setResultados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extrai o parâmetro "nome" da URL
  const nomeBusca = new URLSearchParams(location.search).get("nome");

  // Estados para os campos do filtro avançado
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [institution, setInstitution] = useState("");
  const [keyword, setKeyword] = useState("");
  const [orcid, setOrcid] = useState("");

  // Função para tratar a busca avançada e navegar para a nova URL de pesquisa
  const handleAdvancedSearch = (e) => {
    e.preventDefault();
    const query = [];

    if (firstName) query.push(`given-names:${firstName}`);
    if (lastName) query.push(`family-name:${lastName}`);
    if (institution) query.push(`text:${institution}`);
    if (keyword) query.push(`keyword:${keyword}`);
    if (orcid) query.push(`orcid:${orcid}`);

    const fullQuery = query.join(" AND ");
    console.log(encodeURIComponent(fullQuery));
    navigate(`/pesquisa?nome=${encodeURIComponent(fullQuery)}`);
  };

  // Função para exibir os termos da busca de forma amigável
  const mostrarTermosBusca = () => {
    if (!nomeBusca) return "";
    if (!nomeBusca.includes(":")) return `: "${nomeBusca}"`;

    const termos = nomeBusca.split(" AND ").map(term => {
      const [campo, valor] = term.split(":");
      switch (campo) {
        case "given-names":
          return ` o primeiro nome "${valor}"`;
        case "family-name":
          return ` o último nome "${valor}"`;
        case "text":
          return ` a instituição "${valor}"`;
        case "keyword":
          return ` a(s) palavra-chave(s) "${valor}"`;
        default:
          return `${campo}: ${valor}`;
      }
    });

    return termos.join(" e ");
  };

  // Efeito para buscar pesquisadores sempre que o termo de busca mudar
  useEffect(() => {
    if (!nomeBusca) return;

    // Se for uma busca por ORCID, redireciona para a página de pesquisa por ID
    const orcidMatch = nomeBusca.match(/orcid:([\d\-X]+)/i);
    if (orcidMatch && orcidMatch[1]) {
      navigate(`/pesquisaID?orcid=${orcidMatch[1]}`);
      return;
    }

    // Função assíncrona para buscar pesquisadores pelo nome
    const buscarPorNome = async () => {
      setCarregando(true);
      try {
        let queryParam;
        // Monta o parâmetro de busca conforme o formato do ORCID
        if (nomeBusca.includes(":")) {
          queryParam = nomeBusca;
        } else {
          const terms = nomeBusca.trim().split(/\s+/);
          queryParam = terms.length >= 2
            ? `given-names:${terms[0]} AND family-name:${terms[terms.length - 1]}`
            : nomeBusca;
        }

        // Faz a requisição para a API do ORCID
        const res = await fetch(`https://pub.orcid.org/v3.0/expanded-search/?q=${encodeURIComponent(queryParam)}`, {
          headers: { Accept: "application/json" }
        });

        const data = await res.json();
        // Mapeia os resultados para extrair nome, orcid e instituições
        const lista = data["expanded-result"]?.map(p => {
          const name = `${p["given-names"] || ""} ${p["family-names"] || ""}`;
          const orcid = p["orcid-id"] || p.orcid_id || "Não encontrado";

          const hasInstituicaoArray = Array.isArray(p["institution-name"]) && p["institution-name"].length > 0;
          const instituicoes = hasInstituicaoArray
            ? p["institution-name"].slice(0, 2).join(", ") + (p["institution-name"].length > 2 ? ", ..." : "")
            : "Instituição não informada";

          return {
            orcid,
            name,
            instituicao: instituicoes,
          };
        }) || [];

        // Ordena os pesquisadores com e sem instituição
        const comInstituicao = lista
          .filter(p => p.instituicao && p.instituicao !== "Instituição não informada")
          .sort((a, b) => a.name.localeCompare(b.name));

        const semInstituicao = lista
          .filter(p => !p.instituicao || p.instituicao === "Instituição não informada")
          .sort((a, b) => a.name.localeCompare(b.name));

        const todosPesquisadores = [...comInstituicao, ...semInstituicao];

        // Para cada pesquisador, busca as palavras-chave (keywords)
        const pesquisadoresComKeywords = await Promise.all(
          todosPesquisadores.map(async (p) => {
            try {
              const res = await fetch(`https://pub.orcid.org/v3.0/${p.orcid}/record`, {
                headers: { Accept: "application/json" },
              });
              const data = await res.json();

              const keywords = data.person?.keywords?.keyword?.map((k) => k.content).slice(0, 3).join(", ") || "";

              return {
                ...p,
                keywords,
              };
            } catch (error) {
              console.error("Erro ao buscar keywords para ORCID:", p.orcid, error);
              return {
                ...p,
                keywords: "",
              };
            }
          })
        );

        setResultados(pesquisadoresComKeywords);

      } catch (err) {
        console.error("Erro ao buscar por nome:", err);
      } finally {
        setCarregando(false);
      }
    };

    buscarPorNome();
  }, [nomeBusca, navigate]);

  // Função para navegar para a página de detalhes do pesquisador pelo ORCID
  const irParaPesquisador = (orcid) => {
    navigate(`/pesquisaID?orcid=${orcid}`);
  };

  // Define a quantidade de itens por página e os resultados visíveis
  const itensPorPagina = 20;
  const resultadosVisiveis = resultados.slice(0, paginaAtual * itensPorPagina);

  return (
    <div className="pageWrapper">
      {/* Barra de navegação */}
      <Navbar showSearchBar extraClass="navbar-pesquisador" />

      <section className="searchResults">
        {/* Título com os termos da busca */}
        <h2>
          <span className="h2-res">Resultados para </span>
          <span className="h2-result">{mostrarTermosBusca().replace(/^:\s*/, '')}</span>
        </h2>

        {/* Botão para mostrar/ocultar filtro avançado */}
        <div className="filtro-toggle-container">
        <button
            className="toggle-filtro-btn"
            onClick={() => setMostrarFiltro(!mostrarFiltro)}
        >
            {mostrarFiltro ? "Filtro Avançado ▲" : "Filtro Avançado ▼"}
        </button>
        </div>

        {/* Formulário do filtro avançado */}
        {mostrarFiltro && (
        <form className="filtro-avancado" onSubmit={handleAdvancedSearch}>
            <div className="filtro-linha">
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <div className="input-label-group">
                <input
                type="text"
                placeholder="Institution name"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                />
            </div>
            <input
                type="text"
                placeholder="Keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            </div>

            <div className="filtro-linha">
            <input
                type="text"
                placeholder="ORCID ID"
                className="orcid-input"
                value={orcid}
                onChange={(e) => setOrcid(e.target.value)}
            />

            <button type="submit" className="search-button">
                BUSCAR
            </button>
            </div>
        </form>
        )}

        {/* Exibe mensagem de carregamento, resultados ou mensagem de nenhum resultado */}
        {carregando ? (
          <p>Buscando pesquisadores...</p>
        ) : resultados.length > 0 ? (
          <>
            <p style={{ marginTop: "1rem", fontWeight: "500" }}>
                Mostrando <b>{resultadosVisiveis.length}</b> de <b>{resultados.length}</b>  pesquisadores encontrados.
            </p>
            {/* Tabela com os resultados */}
            <div className="table-wrapper">
              <table className="tabela-resultados">
                <thead>
                  <tr>
                    <th><span>ORCID ID</span></th>
                    <th><span>Nome</span></th>
                    <th><span>Universidades</span></th>
                    <th><span>Palavras-chave</span></th>
                  </tr>
                </thead>

                <tbody>
                  {resultadosVisiveis.map((r, i) => (
                      <tr className="resultCard" key={i}>
                          <td>
                              <button className="link-orcid" onClick={() => irParaPesquisador(r.orcid)}>
                              {r.orcid}
                              </button>
                          </td>
                          <td>{r.name && r.name.trim() !== "" ? r.name : "Sem nome cadastrado"}</td>
                          <td>{r.instituicao}</td>
                          <td>{r.keywords && r.keywords.trim() !== "" ? r.keywords : "Sem palavras-chave cadastradas"}</td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botão para carregar mais resultados */}
            {resultados.length > resultadosVisiveis.length && (
                <div className="ver-mais-container">
                    <button className="ver-mais-btn" onClick={() => setPaginaAtual(paginaAtual + 1)}>
                    Ver mais resultados
                    </button>
                </div>
            )}

          </>
        ) : (
          <p>Nenhum pesquisador encontrado.</p>
        )}
      </section>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default PaginaPesquisaNome;