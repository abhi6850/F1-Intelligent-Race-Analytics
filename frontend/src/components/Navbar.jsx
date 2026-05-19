import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Home",         path: "/" },
    { name: "History",      path: "/history" },
    { name: "Drivers",      path: "/drivers" },
    { name: "Constructors", path: "/constructors" },
    { name: "Tyres",        path: "/tyres" },
    { name: "Tracks",       path: "/tracks" },
    { name: "Analytics",    path: "/analytics" },
  ];

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 40px",
      background: "#0d1117",
      borderBottom: "1px solid #1f2937",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#e10600", fontSize: 18 }}>🏁</span>
        <h2 style={{ color: "#f9fafb", fontSize: 16, fontWeight: 700 }}>F1 Analytics</h2>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {links.map(link => {
          const active = location.pathname === link.path ||
            (link.path !== "/" && location.pathname.startsWith(link.path));
          return (
            <Link
              key={link.name}
              to={link.path}
              style={{
                textDecoration: "none",
                color: active ? "#f9fafb" : "#6b7280",
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                borderBottom: active ? "2px solid #e10600" : "2px solid transparent",
                paddingBottom: 2,
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
