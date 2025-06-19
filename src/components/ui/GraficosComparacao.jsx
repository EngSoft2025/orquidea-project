import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);


/* Métricas de comparação entre dois pesquisadores (total publicações/citações, h-index, i10-index)*/
const GraficosComparacao = ({ pesquisadores }) => {
  if (!pesquisadores[0] || !pesquisadores[1]) return null;

  const metricas = [
    { label: "Total de Publicações", key: "totalPublicacoes" },
    { label: "Total de Citações", key: "totalCitations" },
    { label: "H-index", key: "hIndex" },
    { label: "i10-index", key: "i10Index" },
  ];

  const createGradient = (ctx, chartArea, color1, color2) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, color2);
    gradient.addColorStop(1, color1);
    return gradient;
  };

  const gerarDados = (key) => ({
    labels: [pesquisadores[0].nome, pesquisadores[1].nome],
    datasets: [
      {
        data: [
          Number(pesquisadores[0][key]) || 0,
          Number(pesquisadores[1][key]) || 0,
        ],
        backgroundColor: (context) => {
          const { chart } = context;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return ["#B8860B", "#6A85B6"];
          }
          
          const goldGradient = createGradient(ctx, chartArea, "#FFD700", "#B8860B");
          const royalBlueGradient = createGradient(ctx, chartArea, "#3a7bd5", "#002D62");
          
          return [goldGradient, royalBlueGradient];
        },
        borderRadius: 6,
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#E5E7EB", font: { family: "Montserrat" } },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#E5E7EB", font: { family: "Montserrat" } },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  return (
    <section className="graficos-section">
      <div className="compareTitle">
        <h1 className="h2-res">Comparar Métricas dos Pesquisadores</h1>
      </div>
      <div className="graficos-container">
        {metricas.map(({ label, key }) => (
          <div key={key} className="grafico-wrapper">
            <h3 className="grafico-titulo">{label}</h3>
            <div style={{ height: '300px' }}>
              <Bar data={gerarDados(key)} options={options} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GraficosComparacao;