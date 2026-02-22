export default function ResultCard({ title, children }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "16px",
      borderRadius: "8px",
      marginTop: "10px",
      background: "#fafafa"
    }}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
