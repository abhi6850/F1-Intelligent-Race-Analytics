export default function Loader({ text = "Loading..." }) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>{text}</p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    gap: "15px"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #1f2937",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  text: {
    color: "#9ca3af",
    fontSize: "14px"
  }
};
