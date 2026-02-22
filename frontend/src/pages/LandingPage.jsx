import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div style={{
      minHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "40px"
    }}>
      <h1 style={{
        fontSize: "48px",
        marginBottom: "20px",
        background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        F1 Intelligent Race Analytics
      </h1>

      <p style={{ maxWidth: "700px", marginBottom: "40px", color: "#9ca3af" }}>
        AI-powered strategy simulation, lap delta prediction,
        undercut analysis and race pace modeling.
      </p>

      <Link
        to="/analytics"
        style={{
          background: "linear-gradient(90deg, #1e40af, #2563eb)",
          padding: "12px 25px",
          borderRadius: "8px",
          textDecoration: "none",
          color: "white",
          fontWeight: "500"
        }}
      >
        Enter Analytics Dashboard
      </Link>
    </div>
  );
}
