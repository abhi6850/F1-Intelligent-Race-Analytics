import { useState } from "react";
import { getTyreDegradation } from "../api/backend";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function TyreDegradationChart({
    selectedTrack,
    selectedDriver,
    selectedTeam
}) {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCompute = async () => {
        if (!selectedTrack || !selectedDriver || !selectedTeam) return;

        setLoading(true);
        try {
            const res = await getTyreDegradation(
                selectedTrack,
                selectedDriver,
                selectedTeam
            );

            // Convert backend format to chart format
            const formatted = [];

            const maxLaps = res[0].data.length;

            for (let i = 0; i < maxLaps; i++) {
                formatted.push({
                    tyre_life: res[0].data[i].tyre_life,
                    Soft: res.find(c => c.compound === "Soft")?.data[i]?.lap_delta,
                    Medium: res.find(c => c.compound === "Medium")?.data[i]?.lap_delta,
                    Hard: res.find(c => c.compound === "Hard")?.data[i]?.lap_delta
                });
            }

            setChartData(formatted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: "40px" }}>
            <h3>Tyre Degradation Visualizer</h3>
            <p className="module-description">
                Shows how tyre performance decreases over laps and how it affects lap time.
            </p>

            <button onClick={handleCompute} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Tyre Degradation"}
            </button>

            {chartData && (
                <div style={{ marginTop: "20px", width: "100%", height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="tyre_life" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Soft" stroke="#ff0000" strokeWidth={3} dot={false} />
                            <Line type="monotone" dataKey="Medium" stroke="#ffaa00" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            <Line type="monotone" dataKey="Hard" stroke="#0000ff" strokeWidth={2} dot={false} />

                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
