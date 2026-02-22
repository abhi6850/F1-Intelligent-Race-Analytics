import { useState } from "react";
import eras from "../data/eras";



export default function History() {

  const [activeEra, setActiveEra] = useState(0);

  return (
    <div style={{ padding: "60px" }}>

      <h1 style={{
        fontSize: "42px",
        marginBottom: "40px",
        textAlign: "center"
      }}>
        Evolution of Formula 1
      </h1>

      {/* TIMELINE NAVIGATION */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginBottom: "40px",
        flexWrap: "wrap"
      }}>
        {eras.map((era, index) => (
          <div
            key={index}
            onClick={() => setActiveEra(index)}
            style={{
              cursor: "pointer",
              padding: "10px 20px",
              borderRadius: "8px",
              background: activeEra === index ? "#1f2937" : "#111827",
              color: activeEra === index ? "#3b82f6" : "#9ca3af",
              transition: "0.3s ease"
            }}
          >
            {era.title.split("–")[0]}
          </div>
        ))}
      </div>

      {/* ERA CONTENT */}
      <div style={{
        display: "flex",
        gap: "40px",
        alignItems: "center",
        flexWrap: "wrap"
      }}>

        <div style={{ flex: 1, minWidth: "350px" }}>
          <h2 style={{ marginBottom: "20px" }}>
            {eras[activeEra].title}
          </h2>

          <p style={{ lineHeight: "1.8", fontSize: "17px" }}>
            {eras[activeEra].description}
          </p>
        </div>

        <div style={{
          flex: 1,
          minWidth: "350px",
          display: "flex",
          justifyContent: "center"
        }}>
          <img
            src={`/history/era_${activeEra}.jpg`}
            alt="F1 Era"
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "16px",
              transition: "0.5s ease"
            }}
          />
        </div>

      </div>

    </div>
  );
}
