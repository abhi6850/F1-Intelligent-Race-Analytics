import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "History", path: "/history" },
    { name: "Drivers", path: "/drivers" },
    { name: "Tyres", path: "/tyres" },
    { name: "Tracks", path: "/tracks" },
    { name: "Analytics", path: "/analytics" }
  ];

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 40px",
      background: "#111827",
      borderBottom: "1px solid #1f2937"
    }}>
      <h2 style={{ color: "#3b82f6" }}>🏁 F1 Analytics</h2>

      <div style={{ display: "flex", gap: "25px" }}>
        {links.map(link => (
          <Link
            key={link.name}
            to={link.path}
            style={{
              textDecoration: "none",
              color: location.pathname === link.path ? "#3b82f6" : "#9ca3af",
              fontWeight: "500"
            }}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
