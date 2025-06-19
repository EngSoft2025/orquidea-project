import React, { useState } from 'react';

// Componente modal para buscar e selecionar um pesquisador pelo nome ou ORCID ID
const PesquisadorSearchModal = ({ onClose, onSelectPesquisador }) => {
    // Estado para armazenar o termo de busca digitado pelo usuário
    const [searchTerm, setSearchTerm] = useState('');
    // Estado para armazenar os resultados da busca
    const [results, setResults] = useState([]);
    // Estado para indicar se a busca está em andamento
    const [isLoading, setIsLoading] = useState(false);
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState('');

    // Função chamada ao realizar a busca
    const handleSearch = async () => {
        const query = searchTerm.trim();
        // Valida se o campo está vazio
        if (!query) {
            setError('Por favor, digite um nome ou ORCID ID.');
            return;
        }
        // Expressão regular para validar o formato do ORCID ID
        const orcidRegex = /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/i;

        // Se for um ORCID válido, seleciona diretamente
        if (orcidRegex.test(query)) {
            onSelectPesquisador(query);
            onClose();
            return;
        }

        // Inicia a busca por nome
        setIsLoading(true);
        setError('');
        setResults([]);

        try {
            // Monta o parâmetro de busca para a API do ORCID
            const queryParam = `given-names:${query.split(' ')[0]} AND family-name:${query.split(' ').slice(1).join(' ')}`;
            // Faz a requisição para a API do ORCID
            const response = await fetch(`https://pub.orcid.org/v3.0/expanded-search/?q=${encodeURIComponent(queryParam)}`, {
                headers: { Accept: "application/json" },
            });
            const data = await response.json();
            // Mapeia os resultados retornados pela API
            const searchResults = data["expanded-result"]?.map(p => ({
                orcid: p["orcid-id"],
                name: `${p["given-names"] || ""} ${p["family-names"] || ""}`,
                institution: p["institution-name"]?.[0] || 'Instituição não informada',
            })) || [];

            // Se não houver resultados, exibe mensagem de erro
            if (searchResults.length === 0) {
                setError('Nenhum pesquisador encontrado com este nome.');
            }
            setResults(searchResults);
        } catch (err) {
            // Trata erros de requisição
            console.error("Erro na busca por nome:", err);
            setError('Ocorreu um erro ao buscar. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Overlay do modal, fecha ao clicar fora do conteúdo
        <div className="modal-overlay" onClick={onClose}>
            {/* Conteúdo do modal, impede propagação do clique */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Botão para fechar o modal */}
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Adicionar Pesquisador</h2>
                {/* Barra de busca */}
                <div className="modal-search-bar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Digite o nome ou ORCID ID do pesquisador"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {/* Botão de busca */}
                    <button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
                {/* Exibe mensagem de erro, se houver */}
                {error && <p className="modal-error">{error}</p>}
                {/* Lista de resultados */}
                <div className="modal-results">
                    {results.map((r) => (
                        // Cada resultado pode ser selecionado clicando
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