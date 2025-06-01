import React, { useEffect, useState } from "react";
import { feature } from "topojson-client";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MapaAfiliacoes = ({ affiliations }) => {
  const [geographies, setGeographies] = useState([]);

  useEffect(() => {
    fetch(geoUrl)
      .then((res) => res.json())
      .then((data) => {
        const geoFeatures = feature(data, data.objects.countries).features;
        setGeographies(geoFeatures);
      });
  }, []);

  const paises = Array.from(
    new Set(affiliations.map((a) => a.institution?.country_code?.toUpperCase()))
  );

  console.log("📌 Países afiliados no mapa:", paises);

  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <h3
        style={{
          marginBottom: "1rem",
          background: "linear-gradient(90deg, #FFD700, #B8860B)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Mapa de Afiliações por País
      </h3>
      <ComposableMap
        projectionConfig={{ scale: 130 }}
        style={{
          width: "100%",
          maxWidth: "1300px",
          margin: "0 auto",
          background: "#1e293b",
          borderRadius: "12px",
        }}
      >
        {geographies.length > 0 && (
          <Geographies geography={{ features: geographies }}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const code = geo.properties.iso_a2;
                const isAfiliado = code && paises.includes(code);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isAfiliado ? "#FFD700" : "#2f3542"}
                    stroke="#1a1a1a"
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#facc15", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        )}
      </ComposableMap>
    </div>
  );
};

export default MapaAfiliacoes;
