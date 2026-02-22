import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from "recharts";

export default function StrategyCurveChart({ data, optimalLap }) {
  if (!data || data.length === 0) return null;

  // Find minimum delta for highlighting
  const minPoint = data.reduce((min, p) =>
    p.total_delta < min.total_delta ? p : min
  );

  return (
    <div style={{ width: "100%", height: 320, marginTop: "25px" }}>
      <h4 style={{ marginBottom: "10px" }}>
        📈 Strategy Curve (Pit Lap vs Total Race Delta)
      </h4>

      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="pit_lap"
            label={{ value: "Pit Lap", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            label={{
              value: "Total Race Delta (sec)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total_delta"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
          />

          {/* 🔴 Highlight optimal pit lap */}
          <ReferenceDot
            x={minPoint.pit_lap}
            y={minPoint.total_delta}
            r={6}
            fill="red"
            stroke="none"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
