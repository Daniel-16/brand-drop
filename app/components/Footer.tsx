export default function Footer() {
  return (
    <footer
      style={{
        padding: "24px 40px",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
        position: "relative",
        zIndex: 5,
      }}
    >
      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
        Powered by <span style={{ color: "var(--gold)" }}>Gemini 3.1</span> ·
        Built by Daniel Toba ✦
      </p>
    </footer>
  );
}
