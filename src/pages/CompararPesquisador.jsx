import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import GraficosComparacao from "../components/ui/GraficosComparacao";
import PesquisadorSearchModal from "../components/ui/PesquisadorSearchModal";

// Função assíncrona para buscar dados do pesquisador usando ORCID e OpenAlex
const fetchPesquisador = async (orcidID) => {
  try {
    // Busca dados do ORCID (record e works) em paralelo
    const [rec, wrk] = await Promise.all([
      fetch(`https://pub.orcid.org/v3.0/${orcidID}/record`, { headers: { Accept: "application/json" } }).then((r) => r.json()),
      fetch(`https://pub.orcid.org/v3.0/${orcidID}/works`, { headers: { Accept: "application/json" } }).then((r) => r.json()),
    ]);
    // Busca dados do OpenAlex usando o ORCID
    const openAlexSearch = await fetch(`https://api.openalex.org/authors?filter=orcid:${orcidID}`).then((r) => r.json());
    const authorOpenAlex = openAlexSearch?.results?.[0];
    // Extrai métricas do OpenAlex
    const hIndex = authorOpenAlex?.summary_stats?.h_index ?? "N/A";
    const i10Index = authorOpenAlex?.summary_stats?.i10_index ?? "N/A";
    const totalCitations = authorOpenAlex?.cited_by_count ?? "N/A";
    const openAlexId = authorOpenAlex?.id ?? null;
    let venues = [];
    try {
      // Busca as principais publicações do pesquisador no OpenAlex
      if (openAlexId) {
        const worksOpenAlex = await fetch(`https://api.openalex.org/works?filter=author.id:${openAlexId}&sort=cited_by_count:desc&per_page=5`).then((r) => r.json());
        venues = worksOpenAlex.results.map((work) => ({ title: work.display_name, year: work.publication_year, venue: work.primary_location?.source?.display_name || "Desconhecido" }));
      }
    } catch (e) { console.warn("Erro ao buscar venues no OpenAlex:", e); }
    // Processa as publicações do ORCID
    const works = (wrk.group || []).map((g) => {
      const s = g["work-summary"]?.[0]; const year = parseInt(s?.["publication-date"]?.year?.value);
      return { title: s?.title?.title?.value, year: isNaN(year) ? null : year, type: s?.type || "unknown" };
    }).filter(w => w.year !== null).sort((a, b) => b.year - a.year);
    // Calcula métricas de tempo de atividade e média de publicações
    const anoMaisRecente = works[0]?.year ?? "N/A";
    const anoMaisAntigo = works.at(-1)?.year ?? "N/A";
    const tempoAtivo = (anoMaisRecente !== "N/A" && anoMaisAntigo !== "N/A") ? anoMaisRecente - anoMaisAntigo : "N/A";
    const mediaPorAno = tempoAtivo !== "N/A" && tempoAtivo > 0 ? (works.length / tempoAtivo).toFixed(1) : "N/A";
    const affiliations = authorOpenAlex?.affiliations || [];
    // Retorna objeto com todos os dados do pesquisador
    return {
      nome: rec.person.name ? `${rec.person.name["given-names"].value} ${rec.person.name["family-name"].value}`: "Nome não encontrado", orcidID,
      totalPublicacoes: (wrk.group || []).length, keywords: rec.person.keywords?.keyword?.map(k => k.content) || [],
      artigos: works.slice(0, 4), anoPrimeira: anoMaisAntigo, tempoAtivo, mediaPublicacoesAno: mediaPorAno,
      tiposPublicacao: Object.fromEntries(
        works.reduce((map, w) => { map.set(w.type, (map.get(w.type) || 0) + 1); return map; }, new Map())
      ), hIndex, i10Index, totalCitations,
      meanCitedness: authorOpenAlex?.summary_stats?.["2yr_mean_citedness"] ?? "N/A", affiliations, venues,
    };
  } catch (err) { 
    // Em caso de erro, retorna mensagem de erro
    console.error(err); 
    return { erro: "ORCID inválido ou erro na busca." }; 
  }
};

// Componente de cartão para exibir informações do pesquisador ou botão para adicionar
const CardComparacao = ({ pesquisador, index, onAdd, onRemove, onOpenModal }) => {

  // Função para traduzir tipos de publicação
  const traduzirTipo = (tipo) => {
  const mapa = { "journal-article": "Artigo de periódico", "conference-paper": "Artigo de conferência", "book-chapter": "Capítulo de livro", "book": "Livro", "other": "Outro" };
  return mapa[tipo] || tipo;
  };

  return (
  <div className="researchCard comparar">
    {pesquisador ? (
    pesquisador.erro ? (
      // Exibe mensagem de erro e botão para trocar pesquisador
      <div className="addResearcher flex-col gap-4">
      <p style={{ color: "#ef4444", textAlign: 'center' }}>{pesquisador.erro}</p>
      <button className="submit-button" onClick={() => { onRemove(index); onOpenModal(index); }}>Trocar pesquisador</button>
      </div>
    ) : (
      // Exibe informações detalhadas do pesquisador
      <>
      <div className="card-comparacao-header">
        <img src="/user-research.png" alt="avatar" />
        <p className="researchName">{pesquisador.nome}</p>
      </div>
      <div className="card-comparacao-body">
        <p><strong>ORCID ID:</strong> {pesquisador.orcidID}</p>
        <p><strong>H-index:</strong> {pesquisador.hIndex}</p>
        <p><strong>i10-index:</strong> {pesquisador.i10Index}</p>
        <p><strong>Citações médias (2 anos):</strong> {pesquisador.meanCitedness}</p>
        <p><strong>Total de citações:</strong> {pesquisador.totalCitations}</p>
        <p><strong>Total de publicações:</strong> {pesquisador.totalPublicacoes}</p>
        <p><strong>Número de palavras-chave:</strong> {pesquisador.keywords.length}</p>
        <p><strong>Última publicação:</strong> {pesquisador.artigos[0]?.year || "N/A"}</p>
        <p><strong>Título mais recente:</strong> {pesquisador.artigos[0]?.title || "N/A"}</p>
        <p><strong>Ano da 1ª publicação:</strong> {pesquisador.anoPrimeira}</p>
        <p><strong>Tempo ativo:</strong> {pesquisador.tempoAtivo} anos</p>
        <p><strong>Média de publicações/ano:</strong> {pesquisador.mediaPublicacoesAno}</p>
        {/* Lista os tipos de publicação */}
        {pesquisador.tiposPublicacao && (
        <div>
          <p><strong>Tipos de publicação:</strong></p>
          <ul className="lista-tipos">
          {Object.entries(pesquisador.tiposPublicacao).map(([tipo, count], i) => (
            <li key={i}>{traduzirTipo(tipo)}: {count}</li>
          ))}
          </ul>
        </div>
        )}
        {/* Lista as afiliações do pesquisador */}
        {pesquisador.affiliations && pesquisador.affiliations.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Instituições afiliadas:</strong></p>
          <ul className="lista-tipos">
          {pesquisador.affiliations.map((a, i) => {
            const nome = a.institution?.display_name;
            const pais = a.institution?.country_code;
            return nome && pais ? ( <li key={i}>{nome} ({pais})</li> ) : null;
          })}
          </ul>
        </div>
        )}
        {/* Lista as palavras-chave */}
        <p><strong>Palavras-chave:</strong></p>
        <div className="keywords-container">
        {pesquisador.keywords.length > 0 ? (
          pesquisador.keywords.map((kw, i) => (<span key={i} className="keyword-box">{kw}</span>))
        ) : (<span className="keyword-box">Nenhuma</span>)}
        </div>
        {/* Lista as principais publicações */}
        {pesquisador.venues && pesquisador.venues.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Principais publicações:</strong></p>
          <ul className="lista-tipos">
          {pesquisador.venues.map((a, i) => (<li key={i}>{a.title} — <em>{a.venue}</em> ({a.year})</li>))}
          </ul>
        </div>
        )}
      </div>
      {/* Botão para trocar pesquisador */}
      <div className="card-comparacao-footer">
        <button className="submit-button" onClick={() => { onRemove(index); setShowInput(true); setInput(""); }}>Trocar pesquisador</button>
      </div>
      </>
    )
    ) : (
    // Botão para adicionar pesquisador caso não exista
    <div className="addResearcher">
      <button className="add-button" onClick={() => onOpenModal(index)} aria-label="Adicionar pesquisador">+</button>
    </div>
    )}
  </div>
  );
};

// Componente principal da página de comparação de pesquisadores
const CompararPesquisador = () => {
  // Estado para armazenar os dois pesquisadores
  const [pesquisadores, setPesquisadores] = useState([null, null]);
  // Hook para ler parâmetros da URL
  const [searchParams] = useSearchParams();
  // Estado para controlar modal de busca
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Índice do pesquisador sendo buscado/adicionado
  const [searchIndex, setSearchIndex] = useState(null);

  // Função para adicionar pesquisador ao estado
  const handleAdd = async (index, orcid) => {
    const dados = await fetchPesquisador(orcid);
    setPesquisadores((prev) => {
      const novoEstado = [...prev];
      novoEstado[index] = dados;
      return novoEstado;
    });
  };

  // Função para remover pesquisador do estado
  const handleRemove = (index) => {
    setPesquisadores(prev => {
      const novoEstado = [...prev];
      novoEstado[index] = null;
      return novoEstado;
    });
  };

  // Abre o modal de busca para um dos pesquisadores
  const handleOpenModal = (index) => {
    setSearchIndex(index);
    setIsModalOpen(true);
  };

  // Seleciona pesquisador no modal e adiciona ao estado
  const handleSelectPesquisador = (orcid) => {
    if (searchIndex !== null) {
      handleAdd(searchIndex, orcid);
    }
    setIsModalOpen(false);
  };
  
  // Efeito para carregar pesquisadores automaticamente se houver parâmetros na URL
  useEffect(() => {
    const orcid1 = searchParams.get("orcid1");
    const orcid2 = searchParams.get("orcid2");
    if (orcid1) handleAdd(0, orcid1);
    if (orcid2) handleAdd(1, orcid2);
  }, [searchParams]);

  return (
    <div className="comparePageWrapper">
      {/* Modal de busca de pesquisador */}
      {isModalOpen && (
        <PesquisadorSearchModal
          onClose={() => setIsModalOpen(false)}
          onSelectPesquisador={handleSelectPesquisador}
        />
      )}
      {/* Barra de navegação */}
      <Navbar showSearchBar extraClass="navbar-pesquisador" />
      <div className="compareTitle"><h1 className="h2-res">Comparar Pesquisadores</h1></div>
      <section className="compareSection">
        <div className="compareContainer">
          {/* Cartão do primeiro pesquisador */}
          <CardComparacao
            pesquisador={pesquisadores[0]}
            index={0}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onOpenModal={handleOpenModal}
          />
          <div className="vs-divider">VS</div>
          {/* Cartão do segundo pesquisador */}
          <CardComparacao
            pesquisador={pesquisadores[1]}
            index={1}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onOpenModal={handleOpenModal}
          />
        </div>
      </section>
      {/* Exibe gráficos de comparação se ambos os pesquisadores estiverem carregados e sem erro */}
      {pesquisadores[0] && !pesquisadores[0].erro && pesquisadores[1] && !pesquisadores[1].erro && (
        <GraficosComparacao pesquisadores={pesquisadores} />
      )}
      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default CompararPesquisador;