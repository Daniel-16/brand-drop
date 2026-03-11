"use client";
import { motion } from "framer-motion";

interface BrandDNA {
  primaryColor: string; secondaryColor: string; accentColor: string;
  typographyStyle: string; typographyMood: string; brandVoice: string;
  targetAudience: string; personalityTags: string[]; visualStyle: string;
  brandEmotion: string; colorRationale: string;
}

interface Props { brandDNA: BrandDNA; businessName: string; onNext: () => void; }

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <motion.div
        whileHover={{ scale: 1.08, y: -3 }}
        style={{
          width: 64, height: 64, borderRadius: 14, background: color,
          boxShadow: `0 8px 24px ${color}55`,
          border: "2px solid rgba(255,255,255,0.06)",
        }}
      />
      <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "monospace", letterSpacing: "0.04em" }}>{color}</span>
      <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, background: "rgba(212,151,59,0.12)" }}
      style={{
        padding: "5px 14px", borderRadius: 100,
        background: "rgba(212,151,59,0.07)", border: "1px solid var(--border-light)",
        fontSize: 12, color: "var(--text-secondary)", fontWeight: 500,
        display: "inline-block", cursor: "default",
      }}
    >
      {text}
    </motion.span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", minWidth: 130 }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}

export default function Step2BrandDNA({ brandDNA, businessName, onNext }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(76,175,125,0.1)", border: "1px solid rgba(76,175,125,0.3)",
            marginBottom: 16,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4CAF7D" }} />
          <span style={{ fontSize: 12, color: "#4CAF7D", fontWeight: 500 }}>Brand DNA Extracted</span>
        </motion.div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 600, marginBottom: 8 }}>
          Meet your <span className="text-gold-gradient">{businessName}</span> DNA
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          AI-analyzed brand profile — review before generating content
        </p>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Color Palette */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          style={{
            background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24,
            gridColumn: "span 2",
          }}
        >
          <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
            Color Palette
          </h3>
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
            <ColorSwatch color={brandDNA.primaryColor} label="Primary" />
            <ColorSwatch color={brandDNA.secondaryColor} label="Secondary" />
            <ColorSwatch color={brandDNA.accentColor} label="Accent" />
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, fontStyle: "italic" }}>
                "{brandDNA.colorRationale}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Brand Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}
        >
          <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
            Brand Profile
          </h3>
          <InfoRow label="Brand Voice" value={brandDNA.brandVoice} />
          <InfoRow label="Visual Style" value={brandDNA.visualStyle} />
          <InfoRow label="Typography" value={`${brandDNA.typographyStyle} — ${brandDNA.typographyMood}`} />
          <InfoRow label="Core Emotion" value={brandDNA.brandEmotion} />
          <div style={{ display: "flex", gap: 12, padding: "12px 0" }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", minWidth: 130 }}>Target Audience</span>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{brandDNA.targetAudience}</span>
          </div>
        </motion.div>

        {/* Personality Tags */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}
        >
          <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
            Personality Tags
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {brandDNA.personalityTags?.map((tag, i) => (
              <motion.div key={tag} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
                <Tag text={tag} />
              </motion.div>
            ))}
          </div>

          {/* Visual style badge */}
          <div style={{ marginTop: 24, padding: "16px 20px", borderRadius: 12, background: `${brandDNA.primaryColor}15`, border: `1px solid ${brandDNA.primaryColor}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: brandDNA.primaryColor, flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--text-primary)" }}>{brandDNA.visualStyle}</strong> — {brandDNA.brandEmotion}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{ textAlign: "center", marginTop: 36 }}>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            padding: "14px 48px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)",
            color: "#1a1000", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
            boxShadow: "0 4px 20px rgba(212,151,59,0.3)",
          }}
        >
          Set Up Campaign →
        </motion.button>
      </div>
    </motion.div>
  );
}
