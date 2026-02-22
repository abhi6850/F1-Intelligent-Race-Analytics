import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import Loader from "../components/Loader";


const API_BASE = "http://127.0.0.1:8000";

const thStyle = {
    padding: "10px",
    borderBottom: "1px solid #374151"
};

const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #1f2937"
};


const nationalityToISO = {
    British: "gb",
    Dutch: "nl",
    Monegasque: "mc",
    Spanish: "es",
    French: "fr",
    Australian: "au",
    Mexican: "mx",
    Canadian: "ca",
    German: "de",
    Finnish: "fi",
    Japanese: "jp",
    Chinese: "cn",
    American: "us",
    Thai: "th",
    Danish: "dk",
    "New Zealander": "nz",
};



export default function DriverDetail() {

    const { driverId } = useParams();
    const navigate = useNavigate();
    const [driver, setDriver] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/drivers/${driverId}`)
            .then(res => res.json())
            .then(data => setDriver(data));
    }, [driverId]);

    if (!driver) {
        return <Loader text="Loading driver details..." />;
    }


    if (driver.error) {
        return <h2 style={{ padding: "40px" }}>{driver.error}</h2>;
    }


    // Build cumulative points progression
    const pointsData = [];
    let cumulative = 0;

    driver.race_results.forEach((race) => {
        cumulative += race.points;

        pointsData.push({
            round: race.round,
            points: cumulative
        });
    });

    // Calculate Age
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const age = calculateAge(driver.dateOfBirth);



    return (
        <div style={{ padding: "40px" }}>

            {/* Back Button */}
            <button
                onClick={() => navigate("/drivers")}
                style={{
                    marginBottom: "20px",
                    background: "#1f2937",
                    color: "#3b82f6",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
            >
                ← Back to Drivers
            </button>

            {/* HERO SECTION */}
            <div style={{
                display: "flex",
                gap: "40px",
                alignItems: "center",
                flexWrap: "wrap"
            }}>

                <img
                    src={`/drivers/${driver.driverId}.jpg`}
                    alt={driver.familyName}
                    style={{
                        width: "220px",
                        borderRadius: "12px"
                    }}
                />

                <div>
                    <h2 style={{ fontSize: "36px" }}>
                        {driver.givenName} {driver.familyName}
                    </h2>

                    <p><strong>Number:</strong> #{driver.permanentNumber}</p>
                    <p>
                        <strong>Nationality:</strong>{" "}
                        <img
                            src={`/flags/${nationalityToISO[driver.nationality]}.svg`}
                            alt="flag"
                            style={{
                                width: "28px",
                                verticalAlign: "middle",
                                marginRight: "8px"
                            }}
                        />
                        {driver.nationality}
                    </p>



                    <p><strong>Date of Birth:</strong> {driver.dateOfBirth}</p>
                    <p><strong>Age:</strong> {age}</p>

                </div>
            </div>


            {/* TEAM INFO SECTION */}
            {driver.team && (
                <div style={{ marginTop: "40px" }}>
                    <h3 style={{ marginBottom: "15px" }}>Current Team</h3>

                    <div
                        className="section-card"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            maxWidth: "500px"
                        }}
                    >
                        <img
                            src={`/teams/${driver.team.constructorId}.png`}
                            alt={driver.team.name}
                            style={{
                                width: "80px"
                            }}
                        />

                        <div>
                            <h4>{driver.team.name}</h4>
                            <p>Nationality: {driver.team.nationality}</p>
                        </div>
                    </div>
                </div>
            )}


            {/* PERFORMANCE STATS */}
            <div style={{
                display: "flex",
                gap: "20px",
                marginTop: "40px",
                flexWrap: "wrap"
            }}>
                {Object.entries(driver.stats).map(([key, value]) => (
                    <div
                        key={key}
                        className="section-card"
                        style={{
                            minWidth: "150px",
                            textAlign: "center"
                        }}
                    >
                        <h3>{value}</h3>
                        <p style={{ textTransform: "capitalize" }}>
                            {key.replace("_", " ")}
                        </p>
                    </div>
                ))}
            </div>


            {/* POINTS PROGRESSION GRAPH */}
            <div style={{ marginTop: "50px" }}>
                <h3 style={{ marginBottom: "20px" }}>
                    Season Points Progression
                </h3>

                <div className="section-card" style={{ height: "400px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={pointsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="round" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="points"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>


            {/* RACE RESULTS TABLE */}
            <div style={{ marginTop: "50px" }}>
                <h3 style={{ marginBottom: "20px" }}>Race Results (2023)</h3>

                <div style={{ overflowX: "auto" }}>
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}>
                        <thead>
                            <tr style={{ background: "#1f2937" }}>
                                <th style={thStyle}>Round</th>
                                <th style={thStyle}>Race</th>
                                <th style={thStyle}>Circuit</th>
                                <th style={thStyle}>Grid</th>
                                <th style={thStyle}>Finish</th>
                                <th style={thStyle}>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driver.race_results.map((race, index) => (
                                <tr key={index} style={{ textAlign: "center" }}>
                                    <td style={tdStyle}>{race.round}</td>
                                    <td style={tdStyle}>{race.raceName}</td>
                                    <td style={tdStyle}>{race.circuit}</td>
                                    <td style={tdStyle}>{race.grid}</td>
                                    <td style={tdStyle}>{race.position}</td>
                                    <td style={tdStyle}>{race.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
