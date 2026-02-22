import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function Tyres() {

    const [tyres, setTyres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/tyres`)
            .then(res => res.json())
            .then(data => {
                console.log("Tyres API Response:", data);

                if (!Array.isArray(data)) {
                    setError("Failed to load tyres.");
                    setLoading(false);
                    return;
                }

                setTyres(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Network error.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h2 style={{ padding: "40px" }}>Loading tyres...</h2>;
    }

    if (error) {
        return <h2 style={{ padding: "40px", color: "red" }}>{error}</h2>;
    }

    return (
        <div style={{ padding: "40px" }}>

            <h2 style={{ fontSize: "32px", marginBottom: "30px" }}>
                2023 F1 Tyre Compounds
            </h2>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "25px"
            }}>

                {tyres.map((tyre, index) => (
                    <div key={index} className="section-card">

                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "20px"
                        }}>
                            <img
                                src={tyre.image}
                                alt={tyre.compound}
                                onError={(e) => {
                                    console.warn("Missing image:", tyre.image);
                                    e.target.style.display = "none";
                                }}
                                style={{
                                    width: "170px",
                                    height: "170px",
                                    objectFit: "contain",
                                    transition: "0.3s ease"
                                }}
                            />
                        </div>


                        <h3 style={{
                            textAlign: "center",
                            fontSize: "20px",
                            marginBottom: "15px"
                        }}>
                            {tyre.compound}
                        </h3>

                        <p><strong>Color:</strong> {tyre.color}</p>
                        <p><strong>Compound Range:</strong> {tyre.code}</p>
                        <p><strong>Average Life:</strong> {tyre.avg_life_min}–{tyre.avg_life_max} laps</p>

                        <p style={{ marginTop: "10px" }}>
                            <b>{tyre.description}</b>
                        </p>

                    </div>
                ))}

            </div>
        </div>
    );
}
