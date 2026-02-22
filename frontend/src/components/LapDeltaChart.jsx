import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function LapDeltaChart({ lapDeltas }) {
  if (!lapDeltas || lapDeltas.length === 0) return null;

  const data = {
    labels: lapDeltas.map(d => d.lap),
    datasets: [
      {
        label: "Lap Delta (sec)",
        data: lapDeltas.map(d => d.delta),
        borderColor: "#d90429",
        backgroundColor: "rgba(217,4,41,0.2)",
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ width: "700px", marginTop: "30px" }}>
      <Line data={data} />
    </div>
  );
}
