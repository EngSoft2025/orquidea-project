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

  const gerarDados = (key) => ({
    labels: [pesquisadores[0].nome, pesquisadores[1].nome],
    datasets: [
      {
        label: key,
        data: [
          Number(pesquisadores[0][key]) || 0,
          Number(pesquisadores[1][key]) || 0,
        ],
        backgroundColor: ["#FFD700", "#38bdf8"],
        borderRadius: 6,
      },
    ],
  });

  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#fff", font: { family: "Montserrat" } },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#fff", font: { family: "Montserrat" } },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="graficos-container" style={{ padding: "2rem", color: "white" }}>
      <div className="compareTitle">
        <h1 className="h2-res">Comparar Métricas dos Pesquisadores</h1>
      </div>
      <br></br>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignContent: "center",
        rowGap: "2rem",
        marginTop: "2rem",
        maxWidth: "1300px",
        margin: "0 auto", 
      }}>
        {metricas.map(({ label, key }, i) => (
          <div key={i} style={{
            width: "48%",
            background: "#1e293b",
            borderRadius: "12px",
            padding: "1rem",
          }}>
            <h4 style={{ color: "#fff", textAlign: "center", marginBottom: "1rem" }}>{label}</h4>
            <Bar data={gerarDados(key)} options={options} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficosComparacao;
