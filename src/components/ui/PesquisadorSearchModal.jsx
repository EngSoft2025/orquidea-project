import React, { useState } from 'react';

const PesquisadorSearchModal = ({ onClose, onSelectPesquisador }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const query = searchTerm.trim();
    if (!query) {
      setError('Por favor, digite um nome ou ORCID ID.');
      return;
    }
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/i;

    if (orcidRegex.test(query)) {
      onSelectPesquisador(query);
      onClose();
      return;
    }

    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      const queryParam = `given-names:${query.split(' ')[0]} AND family-name:${query.split(' ').slice(1).join(' ')}`;
      const response = await fetch(`https://pub.orcid.org/v3.0/expanded-search/?q=${encodeURIComponent(queryParam)}`, {
        headers: { Accept: "application/json" },
      });
      const data = await response.json();
      const searchResults = data["expanded-result"]?.map(p => ({
        orcid: p["orcid-id"],
        name: `${p["given-names"] || ""} ${p["family-names"] || ""}`,
        institution: p["institution-name"]?.[0] || 'Instituição não informada',
      })) || [];

      if (searchResults.length === 0) {
        setError('Nenhum pesquisador encontrado com este nome.');
      }
      setResults(searchResults);
    } catch (err) {
      console.error("Erro na busca por nome:", err);
      setError('Ocorreu um erro ao buscar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Adicionar Pesquisador</h2>
        <div className="modal-search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou ORCID ID do pesquisador"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {error && <p className="modal-error">{error}</p>}
        <div className="modal-results">
          {results.map((r) => (
            <div key={r.orcid} className="modal-result-item" onClick={() => onSelectPesquisador(r.orcid)}>
              <p className="result-name">{r.name}</p>
              <p className="result-institution">{r.institution}</p>
              <p className="result-orcid">{r.orcid}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PesquisadorSearchModal;