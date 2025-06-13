import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import GraficosComparacao from "../components/ui/GraficosComparacao";

const fetchPesquisador = async (orcidID) => {
  try {
    const [rec, wrk] = await Promise.all([
      fetch(`https://pub.orcid.org/v3.0/${orcidID}/record`, {
        headers: { Accept: "application/json" },
      }).then((r) => r.json()),
      fetch(`https://pub.orcid.org/v3.0/${orcidID}/works`, {
        headers: { Accept: "application/json" },
      }).then((r) => r.json()),
    ]);

    const openAlexSearch = await fetch(`https://api.openalex.org/authors?filter=orcid:${orcidID}`)
      .then((r) => r.json());

    const authorOpenAlex = openAlexSearch?.results?.[0];

    const hIndex = authorOpenAlex?.summary_stats?.h_index ?? "N/A";
    const i10Index = authorOpenAlex?.summary_stats?.i10_index ?? "N/A";
    const totalCitations = authorOpenAlex?.cited_by_count ?? "N/A";
    const openAlexId = authorOpenAlex?.id ?? null;

    const rankGlobal = authorOpenAlex?.ranks?.cited_by_count?.position ?? "N/A";
    const totalAutoresRankeados = authorOpenAlex?.ranks?.cited_by_count?.total ?? "N/A";
    const meanCitedness = authorOpenAlex?.summary_stats?.["2yr_mean_citedness"] ?? "N/A";
    let venues = [];
    try {
    if (openAlexId) {
        const worksOpenAlex = await fetch(
        `https://api.openalex.org/works?filter=author.id:${openAlexId}&sort=cited_by_count:desc&per_page=5`
        ).then((r) => r.json());

        venues = worksOpenAlex.results.map((work) => ({
        title: work.display_name,
        year: work.publication_year,
        venue: work.primary_location?.source?.display_name || "Desconhecido",
        }));

    }
    } catch (e) {
    console.warn("Erro ao buscar venues no OpenAlex:", e);
    }

    console.log(venues);

    const works = (wrk.group || [])
      .map((g) => {
        const s = g["work-summary"]?.[0];
        const year = parseInt(s?.["publication-date"]?.year?.value);
        return {
          title: s?.title?.title?.value,
          year: isNaN(year) ? null : year,
          type: s?.type || "unknown",
        };
      })
      .filter(w => w.year !== null)
      .sort((a, b) => b.year - a.year);

    const anoMaisRecente = works[0]?.year ?? "N/A";
    const anoMaisAntigo = works.at(-1)?.year ?? "N/A";
    const tempoAtivo = (anoMaisRecente !== "N/A" && anoMaisAntigo !== "N/A")
      ? anoMaisRecente - anoMaisAntigo
      : "N/A";

    const mediaPorAno =
      tempoAtivo !== "N/A" && tempoAtivo > 0
        ? (works.length / tempoAtivo).toFixed(1)
        : "N/A";

    const afiliacoes = rec["activities-summary"]?.employments?.["employment-summary"] || [];
    const afiliacaoAtual = afiliacoes[0]?.organization?.name || "Não informado";
    const paisAfiliacaoCod = afiliacoes[0]?.organization?.address?.country || "N/A";
    const nomePais = 
    paisAfiliacaoCod && /^[A-Z]{2}$/.test(paisAfiliacaoCod)
        ? new Intl.DisplayNames(['pt'], { type: 'region' }).of(paisAfiliacaoCod)
        : "N/A";

    const affiliations = authorOpenAlex?.affiliations || [];
    const instituicoesComPais = affiliations.map((a) => {
        const nome = a.institution?.display_name;
        const pais = a.institution?.country_code;
        return nome && pais ? `${nome} (${pais})` : null;
    }).filter(Boolean);

    const biografia = rec.person?.biography?.content || null;

    return {
        nome: `${rec.person.name["given-names"].value} ${rec.person.name["family-name"].value}`,
        orcidID,
        afiliacao: afiliacaoAtual,
        paisAfiliacao: nomePais,
        biografia,
        totalPublicacoes: (wrk.group || []).length,
        keywords: rec.person.keywords?.keyword?.map(k => k.content) || [],
        artigos: works.slice(0, 4),
        anoPrimeira: anoMaisAntigo,
        tempoAtivo,
        mediaPublicacoesAno: mediaPorAno,
        tiposPublicacao: Object.fromEntries(
            works.reduce((map, w) => {
            map.set(w.type, (map.get(w.type) || 0) + 1);
            return map;
            }, new Map())
        ),
        hIndex,
        i10Index,
        totalCitations,
        openAlexId,
        rankGlobal,
        totalAutoresRankeados,
        meanCitedness,
        affiliations,
        venues,
    };


  } catch (err) {
    console.error(err);
    return { erro: "ORCID inválido ou erro na busca." };
  }
};


const CardComparacao = ({ pesquisador, index, onAdd, onRemove }) => {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");

  const handleAdicionar = () => {
    if (input.trim()) {
      onAdd(index, input.trim());
    }
  };

  const traduzirTipo = (tipo) => {
    const mapa = {
        "journal-article": "Artigo de periódico",
        "conference-paper": "Artigo de conferência",
        "book-chapter": "Capítulo de livro",
        "book": "Livro",
        "other": "Outro",
    };
    return mapa[tipo] || tipo;
  };



  return (
    <div className="researchCard comparar">
  {pesquisador ? (
    pesquisador.erro ? (
      <p style={{ color: "red" }}>{pesquisador.erro}</p>
    ) : (
      <>
        <img src="/user-research.png" alt="avatar" />
        <p className="researchName">{pesquisador.nome}</p>
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
        {pesquisador.affiliations && pesquisador.affiliations.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
            <p><strong>Instituições afiliadas:</strong></p>
            <ul className="lista-tipos">
            {pesquisador.affiliations.map((a, i) => {
                const nome = a.institution?.display_name;
                const pais = a.institution?.country_code;
                return nome && pais ? (
                <li key={i}>{nome} ({pais})</li>
                ) : null;
            })}
            </ul>
        </div>
        )}

        <p><strong>Palavras-chave:</strong></p>
        <div className="keywords-container">
        {pesquisador.keywords.length > 0 ? (
            pesquisador.keywords.map((kw, i) => (
            <span key={i} className="keyword-box">{kw}</span>
            ))
        ) : (
            <span className="keyword-box">Nenhuma</span>
        )}
        </div>


        {pesquisador.venues && pesquisador.venues.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
            <p><strong>Principais publicações:</strong></p>
            <ul className="lista-tipos">
            {pesquisador.venues.map((a, i) => (
                <li key={i}>
                {a.title} — <em>{a.venue}</em> ({a.year})
                </li>
            ))}
            </ul>
        </div>
        )}

        <br></br>
        <button
        className="submit-button"
        onClick={() => {
            onRemove(index);
            setShowInput(true);
            setInput("");
        }}
        >
        Trocar pesquisador
        </button>

      </>
    )
  ) : showInput ? (
    <>
      <input
        type="text"
        className="searchbarComp"
        placeholder="Digite o ORCID"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="submit-button" onClick={handleAdicionar}>
        Adicionar
      </button>
    </>
  ) : (
    <div className="addResearcher">
      <button
        className="add-button"
        onClick={() => setShowInput(true)}
        aria-label="Adicionar pesquisador"
      >
        +
      </button>
    </div>
  )}
</div>


  );
};

const CompararPesquisador = () => {
  const [pesquisadores, setPesquisadores] = useState([null, null]);
  const [searchParams] = useSearchParams();

    const handleAdd = async (index, orcid) => {
    const dados = await fetchPesquisador(orcid);
    setPesquisadores((prev) => {
        const novoEstado = [...prev];
        novoEstado[index] = dados;
        return novoEstado;
    });
    };


  const handleRemove = (index) => {
    const novoEstado = [...pesquisadores];
    novoEstado[index] = null;
    setPesquisadores(novoEstado);
  };

  useEffect(() => {
    const orcid1 = searchParams.get("orcid1");
    const orcid2 = searchParams.get("orcid2");

    if (orcid1) handleAdd(0, orcid1);
    if (orcid2) handleAdd(1, orcid2);
  }, [searchParams]);


  const keywordsComuns =
    pesquisadores[0] && pesquisadores[1]
      ? pesquisadores[0].keywords.filter((kw) =>
          pesquisadores[1].keywords.includes(kw)
        )
      : [];

  return (
    <div>
      <Navbar showSearchBar extraClass="navbar-pesquisador" />
      <div className="compareTitle">
        <h1 className="h2-res">Comparar Pesquisadores</h1>
      </div>
      <section className="compareSection">
        <div className="compareContainer">
          <CardComparacao
            pesquisador={pesquisadores[0]}
            index={0}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />

          <div className="vs-stats">
            <div className="vs-divider">VS</div>
          </div>
        <CardComparacao
            pesquisador={pesquisadores[1]}
            index={1}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        </div>
      </section>
        {pesquisadores[0] && pesquisadores[1] && (
        <GraficosComparacao pesquisadores={pesquisadores} />
        )}
      <Footer />
    </div>
  );
};

export default CompararPesquisador;