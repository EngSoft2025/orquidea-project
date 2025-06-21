<h1 align="center">Orquidea ❀🔎 </h1>
<p align="center"> Projeto da disciplina SSC0130 - Engenharia de Software</p>

<p align="center">
  <a href="#estrutura-do-projeto">Estrutura do Projeto</a> • 
   <a href="#documentos">Documentos</a> •
  <a href="#instalacao">Instalação e Uso</a> • 
  <a href="#objetivo">Objetivo</a> • 
  <a href="#tecnologias">Tecnologias</a> • 
  <a href="#estrutura_branches">Estrutura de Branches</a> • 
  <a href="#testes">Testes</a> • 
  <a href="#ciclo">Ciclo de Desenvolvimento</a> • 
  <a href="#cronograma">Cronograma</a> • 
  <a href="#riscos">Gerenciamento de Riscos</a> •
  <a href="#contribuindo">Contribuição</a> •
  <a href="#licenca">Licença</a> •
  <a href="#agradecimentos">Agradecimentos</a>
</p>

<p align="center">
  <table>
    <tr>
      <td align="center">
        <img width="600px" src="https://github.com/EngSoft2025/orquidea-project/blob/dbca4e64f82a96c9e68b7ed8c09286fc0558f08e/assets/home.png?raw=true">
      </td>
      <td align="center">
        <img width="600px" src="https://github.com/EngSoft2025/orquidea-project/blob/dbca4e64f82a96c9e68b7ed8c09286fc0558f08e/assets/perfil.png?raw=true">
      </td>
    </tr>
    <tr>
      <td align="center">
        <img width="600px" src="https://github.com/EngSoft2025/orquidea-project/blob/dbca4e64f82a96c9e68b7ed8c09286fc0558f08e/assets/comparar.png?raw=true">
      </td>
      <td align="center">
        <img width="600px" src="https://github.com/EngSoft2025/orquidea-project/blob/dbca4e64f82a96c9e68b7ed8c09286fc0558f08e/assets/ranking.png?raw=true">
      </td>
    </tr>
  </table>
</p>


<p align="center">
  <b>Orquidea</b> é uma plataforma web para consolidação e análise de dados acadêmicos, desenvolvida pela equipe Lattes Mas Não Morde. A proposta é oferecer uma experiência mais intuitiva, integrada e informativa em relação às soluções atuais, como o Currículo Lattes e o ORCID. O sistema centraliza perfis, citações e métricas de impacto científico a partir de múltiplas fontes, com foco em usabilidade, automação e apoio à gestão de produção acadêmica.
</p>


## <div id="estrutura-do-projeto"></div>Estrutura do Projeto

Este projeto está organizado para facilitar o desenvolvimento e a manutenção de uma aplicação front-end moderna. Abaixo está uma visão geral das principais pastas e arquivos:

```bash
├── assets/              # Arquivos estáticos como imagens e ícones
├── docs/                # Documentação de requisitos, plano de projeto, etc.
├── public/              # Arquivos públicos acessíveis diretamente
├── src/                 # Código-fonte da aplicação
│   └── ...              # Componentes, páginas, estilos, etc.
├── .gitignore           # Arquivos e pastas ignorados pelo Git
├── index.html           # HTML principal da aplicação
├── LICENSE              # Licença do projeto
├── README.md            # Documentação inicial do projeto
├── package.json         # Informações e dependências do projeto
├── package-lock.json    # Registro exato das versões instaladas
├── vite.config.js       # Configuração do Vite (build tool)
```

##  <div id="documentos"></div>Documentos

- [📄 Documento de Requisitos](https://github.com/EngSoft2025/orquidea-project/blob/c2fed515a7676bfbbf78a1705e0da60f5470605e/docs/Especifica%C3%A7%C3%A3o%20de%20Requisitos%20de%20Software.pdf)  
- [🗂️ Plano de Projeto](https://github.com/EngSoft2025/orquidea-project/blob/5a68edbb17e004748c48f546b0bf1616f594b4cd/docs/Plano%20de%20projeto%20-%20Lattes%20Mas%20N%C3%A3o%20Morde.pdf)

## <div id="instalacao"></div>Instalação e Uso

Para instalar as dependências e iniciar o ambiente de desenvolvimento local, execute os seguintes comandos:

```bash
npm install        # Instala todas as dependências do projeto
npm run dev        # Inicia o servidor de desenvolvimento
```

## <div id="objetivo"></div>Objetivo

Criar uma solução que vá além do Lattes e do ORCID, com foco em:

- Interface mais amigável e responsiva
- Integração automática com APIs de dados acadêmicos
- Ferramentas de busca, comparação de perfis e análise de impacto científico

## <div id="tecnologias"></div>Tecnologias

- *Front-end:* Desenvolvido com React.js, focando em interfaces modernas e responsivas.
- *Gerenciamento de Tarefas:* Organização e acompanhamento pelo Notion.
- *Controle de Versão:* Git com repositório no GitHub, seguindo o modelo Git Flow.
- *Integração com APIs:* Conexão com a API do ORCID e outras fontes bibliográficas para extração automatizada de dados.

## <div id="estrutura_branches"></div>Estrutura de Branches

- **main:** versão estável e pronta para uso
- **develop:** versão em desenvolvimento com funcionalidades em teste
- **feature/<nome-da-feature>:** branches específicas para cada funcionalidade ou correção

## <div id="testes"></div>Testes

Realizamos testes em diferentes níveis:

- Testes unitários
- Testes de interface e usabilidade
- Testes de regressão e de fluxo completo
- Testes de desempenho (com grandes volumes de dados)

## <div id="ciclo"></div>Ciclo de Desenvolvimento

1. Registro de issues (bug, melhoria, docs)
2. Triagem quinzenal e priorização (1 a 5)
3. Planejamento e designação de tarefas
4. Desenvolvimento e testes (manuais e automáticos)
5. Revisão de código e integração

## <div id="cronograma"></div>Cronograma

| Incremento | Entrega    | Descrição                                      |
|------------|------------|-----------------------------------------------|
| 1          | 21/05/2025 | Página inicial (protótipo funcional)          |
| 2          | 28/05/2025 | Página de perfil do pesquisador              |
| 3          | 04/06/2025 | Integração com ORCID API                      |
| 4          | 11/06/2025 | Métricas e avaliação              |
| 5          | 18/06/2025 | Sistema de ranqueamento |
| 6          | 22/06/2025 | Entrega do projeto finalizados |

## <div id="riscos"></div>Gerenciamento de Riscos


Problemas previstos:
- Instabilidade ou limitação nas APIs externas
- Dificuldades técnicas com novas tecnologias
- Conflitos de merge e sobrecarga de tarefas

Planos de contingência foram estabelecidos para todos os riscos identificados.

<p align="center">
  
   <img align="center" text-align="center" width="60%" src="https://github.com/EngSoft2025/orquidea-project/blob/6fdc34addce9a9510fc94453ba45c0c51b922f42/assets/manutencao.png">
</p>

## <div id="contribuindo"></div>Contribuição
Contribuições são bem-vindas! Por favor, faça um fork do repositório e envie um pull request com suas alterações.

## <div id="licenca"></div>Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

## <div id="acknowledgements"></div>Agradecimentos
Gostaríamos de agradecer ao professor Seiji Isotani e aos monitores, pela sua orientação e apoio ao longo deste projeto.

## 👥 Equipe

- Felipe de Castro Azambuja - **14675437** ([Github](https://github.com/DeguShi))
- João Pedro Viguini T.T. Correa - **14675503** ([Github](https://github.com/jpviguini))
- Matheus Paiva Angarola - **12560982** ([Github](https://github.com/MatheusPaivaa))
- Pietra Gullo Salgado Chaves - **14603822** ([Github](https://github.com/pijuma))

Estudantes de Bacharelado em Ciência da Computação - USP
