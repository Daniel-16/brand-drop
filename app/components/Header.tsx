import Link from "next/link";

export default function Header() {
  return (
    <Link href="/">
      <header
        style={{
          padding: "24px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
          position: "relative",
          zIndex: 10,
          background: "rgba(8,7,5,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background:
                "linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: "#1a1000" }}>
              B
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Brand<span className="text-gold-gradient">Drop</span>
          </span>
        </div>
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          Brand kit in 60 seconds ✦
        </span>
      </header>
    </Link>
  );
}
