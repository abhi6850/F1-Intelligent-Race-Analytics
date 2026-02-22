import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
} from "recharts";

const API_BASE = "http://127.0.0.1:8000";

export default function StrategyMode() {

    const DRIVERS = [
        { code: "VER", team: "Red Bull Racing" },
        { code: "PER", team: "Red Bull Racing" },
        { code: "HAM", team: "Mercedes" },
        { code: "RUS", team: "Mercedes" },
        { code: "LEC", team: "Ferrari" },
        { code: "SAI", team: "Ferrari" },
        { code: "NOR", team: "McLaren" },
        { code: "PIA", team: "McLaren" },
        { code: "ALO", team: "Aston Martin" },
        { code: "STR", team: "Aston Martin" },
        { code: "OCO", team: "Alpine" },
        { code: "GAS", team: "Alpine" },
        { code: "BOT", team: "Alfa Romeo" },
        { code: "ZHO", team: "Alfa Romeo" },
        { code: "MAG", team: "Haas" },
        { code: "HUL", team: "Haas" },
        { code: "TSU", team: "AlphaTauri" },
        { code: "DEV", team: "AlphaTauri" },
        { code: "ALB", team: "Williams" },
        { code: "SAR", team: "Williams" },
    ];

    const COMPOUNDS = [
        { label: "Soft", value: 0 },
        { label: "Medium", value: 1 },
        { label: "Hard", value: 2 },
    ];

    const TRACKS = [
        "Bahrain Grand Prix",
        "Monaco Grand Prix",
        "Silverstone",
        "Monza",
    ];

    const [track, setTrack] = useState("Bahrain Grand Prix");

    const [strategyA, setStrategyA] = useState({
        driver: "VER",
        compound_start: 0,
        compound_after: 1,
        pit_lap: 18,
    });

    const [strategyB, setStrategyB] = useState({
        driver: "HAM",
        compound_start: 1,
        compound_after: 2,
        pit_lap: 25,
    });

    const [result, setResult] = useState(null);

    const handleCompare = async () => {

        const driverAObj = DRIVERS.find(d => d.code === strategyA.driver);
        const driverBObj = DRIVERS.find(d => d.code === strategyB.driver);

        const payload = {
            track_name: track,
            strategy_a: {
                driver: strategyA.driver,
                team: driverAObj.team,
                compound_start: strategyA.compound_start,
                compound_after: strategyA.compound_after,
                pit_lap: strategyA.pit_lap,
            },
            strategy_b: {
                driver: strategyB.driver,
                team: driverBObj.team,
                compound_start: strategyB.compound_start,
                compound_after: strategyB.compound_after,
                pit_lap: strategyB.pit_lap,
            },
        };

        const response = await fetch(`${API_BASE}/analysis/strategy-mode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        setResult(data);
    };

    return (
        <div style={{ marginTop: "50px" }}>
            <h2>🏁 Strategy Mode – Dual Strategy Comparison</h2>
            <p className="module-description">
                Runs a full race simulation combining tyre wear, pit stops and driver performance.
            </p>

            {/* Track */}
            <div>
                <label>Track:</label>
                <select value={track} onChange={(e) => setTrack(e.target.value)}>
                    {TRACKS.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            {/* Strategy A */}
            <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc" }}>
                <h3>Strategy A</h3>

                <select
                    value={strategyA.driver}
                    onChange={(e) =>
                        setStrategyA({ ...strategyA, driver: e.target.value })
                    }
                >
                    {DRIVERS.map((d) => (
                        <option key={d.code} value={d.code}>{d.code}</option>
                    ))}
                </select>

                <select
                    value={strategyA.compound_start}
                    onChange={(e) =>
                        setStrategyA({ ...strategyA, compound_start: Number(e.target.value) })
                    }
                >
                    {COMPOUNDS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>

                <input
                    type="number"
                    value={strategyA.pit_lap}
                    onChange={(e) =>
                        setStrategyA({ ...strategyA, pit_lap: Number(e.target.value) })
                    }
                />

                <select
                    value={strategyA.compound_after}
                    onChange={(e) =>
                        setStrategyA({ ...strategyA, compound_after: Number(e.target.value) })
                    }
                >
                    {COMPOUNDS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>

            {/* Strategy B */}
            <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc" }}>
                <h3>Strategy B</h3>

                <select
                    value={strategyB.driver}
                    onChange={(e) =>
                        setStrategyB({ ...strategyB, driver: e.target.value })
                    }
                >
                    {DRIVERS.map((d) => (
                        <option key={d.code} value={d.code}>{d.code}</option>
                    ))}
                </select>

                <select
                    value={strategyB.compound_start}
                    onChange={(e) =>
                        setStrategyB({ ...strategyB, compound_start: Number(e.target.value) })
                    }
                >
                    {COMPOUNDS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>

                <input
                    type="number"
                    value={strategyB.pit_lap}
                    onChange={(e) =>
                        setStrategyB({ ...strategyB, pit_lap: Number(e.target.value) })
                    }
                />

                <select
                    value={strategyB.compound_after}
                    onChange={(e) =>
                        setStrategyB({ ...strategyB, compound_after: Number(e.target.value) })
                    }
                >
                    {COMPOUNDS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </div>

            <button onClick={handleCompare} style={{ marginTop: "20px" }}>
                Compare Strategies
            </button>

            {/* Result Section */}
            {result && (
                <div style={{ marginTop: "30px" }}>
                    <h3>
                        Winner:{" "}
                        <span style={{ color: result.winner === "Strategy A" ? "green" : "red" }}>
                            {result.winner}
                        </span>
                    </h3>

                    <p>Total Time A: {result.total_time_a} sec</p>
                    <p>Total Time B: {result.total_time_b} sec</p>
                    <p>Time Difference: {result.time_difference} sec</p>

                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={result.gap_curve}>
                            <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                            <XAxis dataKey="lap" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                            />
                            <Legend />
                            <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} />
                            <Line
                                type="monotone"
                                dataKey="gap"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
