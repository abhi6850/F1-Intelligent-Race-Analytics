import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

const API_BASE = "http://127.0.0.1:8000";

export default function RacePaceSimulator() {

    const DRIVERS = [
        { code: "VER", name: "Max Verstappen", team: "Red Bull Racing" },
        { code: "PER", name: "Sergio Perez", team: "Red Bull Racing" },
        { code: "HAM", name: "Lewis Hamilton", team: "Mercedes" },
        { code: "RUS", name: "George Russell", team: "Mercedes" },
        { code: "LEC", name: "Charles Leclerc", team: "Ferrari" },
        { code: "SAI", name: "Carlos Sainz", team: "Ferrari" },
        { code: "NOR", name: "Lando Norris", team: "McLaren" },
        { code: "PIA", name: "Oscar Piastri", team: "McLaren" },
        { code: "ALO", name: "Fernando Alonso", team: "Aston Martin" },
        { code: "STR", name: "Lance Stroll", team: "Aston Martin" },
        { code: "OCO", name: "Esteban Ocon", team: "Alpine" },
        { code: "GAS", name: "Pierre Gasly", team: "Alpine" },
        { code: "BOT", name: "Valtteri Bottas", team: "Alfa Romeo" },
        { code: "ZHO", name: "Zhou Guanyu", team: "Alfa Romeo" },
        { code: "MAG", name: "Kevin Magnussen", team: "Haas" },
        { code: "HUL", name: "Nico Hulkenberg", team: "Haas" },
        { code: "TSU", name: "Yuki Tsunoda", team: "AlphaTauri" },
        { code: "DEV", name: "Nyck de Vries", team: "AlphaTauri" },
        { code: "ALB", name: "Alexander Albon", team: "Williams" },
        { code: "SAR", name: "Logan Sargeant", team: "Williams" },
    ];

    const TRACKS = [
        "Bahrain Grand Prix",
        "Saudi Arabian Grand Prix",
        "Australian Grand Prix",
        "Azerbaijan Grand Prix",
        "Miami Grand Prix",
        "Monaco Grand Prix",
        "Spanish Grand Prix",
        "Canadian Grand Prix",
        "Austrian Grand Prix",
        "British Grand Prix",
        "Hungarian Grand Prix",
        "Belgian Grand Prix",
        "Dutch Grand Prix",
        "Italian Grand Prix",
        "Singapore Grand Prix",
        "Japanese Grand Prix",
        "Qatar Grand Prix",
        "United States Grand Prix",
        "Mexico City Grand Prix",
        "São Paulo Grand Prix",
        "Las Vegas Grand Prix",
        "Abu Dhabi Grand Prix"
    ];

    const COMPOUNDS = [
        { label: "Soft", value: 0 },
        { label: "Medium", value: 1 },
        { label: "Hard", value: 2 },
    ];

    const [track, setTrack] = useState("");
    const [driverA, setDriverA] = useState("");
    const [driverB, setDriverB] = useState("");
    const [compoundA, setCompoundA] = useState("");
    const [compoundB, setCompoundB] = useState("");

    const [data, setData] = useState([]);
    const [finalGap, setFinalGap] = useState(null);
    const [pitA, setPitA] = useState(null);
    const [pitB, setPitB] = useState(null);

    const simulateRace = async () => {

        if (!track || !driverA || !driverB || compoundA === "" || compoundB === "") {
            alert("Select track, drivers, and compounds");
            return;
        }

        if (driverA === driverB) {
            alert("Drivers must be different");
            return;
        }

        const driverAObj = DRIVERS.find(d => d.code === driverA);
        const driverBObj = DRIVERS.find(d => d.code === driverB);

        const url = `${API_BASE}/analysis/race-simulator?track_name=${encodeURIComponent(track)}&driver_a=${driverAObj.code}&team_a=${encodeURIComponent(driverAObj.team)}&driver_b=${driverBObj.code}&team_b=${encodeURIComponent(driverBObj.team)}&compound_a=${compoundA}&compound_b=${compoundB}&pit_lap_a=20&pit_lap_b=22`;

        const response = await fetch(url);
        const result = await response.json();

        console.log("Race Simulator Result:", result);

        if (result.gap_data) {
            setData(result.gap_data);
            const lastLap = result.gap_data[result.gap_data.length - 1];
            setFinalGap(lastLap.gap);
        }

        setPitA(result.driver_a_pit || null);
        setPitB(result.driver_b_pit || null);
    };

    return (
        <div style={{ marginTop: "40px" }}>
            <h2>Race Pace Simulator</h2>
            <p className="module-description">
                Simulates how two drivers would perform over a full race distance.
            </p>

            <select value={track} onChange={(e) => setTrack(e.target.value)}>
                <option value="">Select Track</option>
                {TRACKS.map((t, index) => (
                    <option key={index} value={t}>{t}</option>
                ))}
            </select>

            <select value={driverA} onChange={(e) => setDriverA(e.target.value)}>
                <option value="">Select Driver A</option>
                {DRIVERS.map((d) => (
                    <option key={d.code} value={d.code}>
                        {d.name} ({d.team})
                    </option>
                ))}
            </select>

            <select value={compoundA} onChange={(e) => setCompoundA(Number(e.target.value))}>
                <option value="">Driver A Compound</option>
                {COMPOUNDS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                ))}
            </select>

            <select value={driverB} onChange={(e) => setDriverB(e.target.value)}>
                <option value="">Select Driver B</option>
                {DRIVERS.map((d) => (
                    <option key={d.code} value={d.code}>
                        {d.name} ({d.team})
                    </option>
                ))}
            </select>

            <select value={compoundB} onChange={(e) => setCompoundB(Number(e.target.value))}>
                <option value="">Driver B Compound</option>
                {COMPOUNDS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                ))}
            </select>

            <button onClick={simulateRace} style={{ margin: "10px" }}>
                Simulate
            </button>

            {finalGap !== null && (
                <h3 style={{ marginTop: "20px" }}>
                    Final Gap:{" "}
                    <span style={{ color: finalGap > 0 ? "red" : "green" }}>
                        {finalGap.toFixed(2)} sec
                    </span>
                </h3>
            )}

            {data.length > 0 && (
                <ResponsiveContainer width="100%" height={450}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="lap" />
                        <YAxis label={{ value: "Gap (sec)", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />

                        <Line
                            type="monotone"
                            dataKey="gap"
                            stroke="#ff0000"
                            strokeWidth={3}
                            dot={false}
                            name="Gap (Driver B - Driver A)"
                        />

                        {pitA && (
                            <ReferenceLine
                                x={pitA}
                                stroke="blue"
                                strokeDasharray="4 4"
                                label="Driver A Pit"
                            />
                        )}

                        {pitB && (
                            <ReferenceLine
                                x={pitB}
                                stroke="green"
                                strokeDasharray="4 4"
                                label="Driver B Pit"
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
