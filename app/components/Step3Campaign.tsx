"use client";
import { motion } from "framer-motion";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

const THEMES = [
  { value: "general_promo", label: "General Promo", emoji: "📣" },
  { value: "new_launch", label: "New Launch", emoji: "🚀" },
  { value: "holiday_sallah", label: "Holiday / Sallah", emoji: "🌙" },
  { value: "owambe_weekend", label: "Owambe / Weekend", emoji: "🎉" },
  { value: "flash_sale", label: "Flash Sale", emoji: "⚡" },
];

const PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: Instagram, color: "#E1306C" },
  { value: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366" },
];

interface Props {
  platforms: string[];
  campaignTheme: string;
  customGoal: string;
  onPlatformToggle: (p: string) => void;
  onThemeChange: (t: string) => void;
  onGoalChange: (g: string) => void;
  onNext: () => void;
}

export default function Step3Campaign({ platforms, campaignTheme, customGoal, onPlatformToggle, onThemeChange, onGoalChange, onNext }: Props) {
  const valid = platforms.length > 0 && campaignTheme;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 600, marginBottom: 10 }}>
          Configure your <span className="text-gold-gradient">campaign</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Choose your platforms and campaign theme
        </p>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Platforms */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>
            Target Platforms
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {PLATFORMS.map(p => {
              const active = platforms.includes(p.value);
              const Icon = p.icon;
              return (
                <motion.button
                  key={p.value}
                  onClick={() => onPlatformToggle(p.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "18px 16px", borderRadius: 14, cursor: "pointer",
                    border: `1.5px solid ${active ? p.color + "60" : "var(--border)"}`,
                    background: active ? `${p.color}10` : "var(--bg-card)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: active ? `${p.color}20` : "var(--bg-card-hover)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${active ? p.color + "40" : "var(--border-light)"}`,
                    transition: "all 0.2s ease",
                  }}>
                    <Icon size={18} style={{ color: active ? p.color : "var(--text-muted)" }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: active ? "var(--text-primary)" : "var(--text-secondary)" }}>
                    {p.label}
                  </span>
                  {active && (
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", background: p.color,
                      boxShadow: `0 0 8px ${p.color}`,
                    }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Campaign Theme */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>
            Campaign Theme
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
            {THEMES.map(t => {
              const active = campaignTheme === t.value;
              return (
                <motion.button
                  key={t.value}
                  onClick={() => onThemeChange(t.value)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "14px 10px", borderRadius: 12, cursor: "pointer",
                    border: `1.5px solid ${active ? "var(--gold)" : "var(--border)"}`,
                    background: active ? "rgba(212,151,59,0.08)" : "var(--bg-card)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{t.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 500, textAlign: "center", color: active ? "var(--gold)" : "var(--text-secondary)", lineHeight: 1.3 }}>
                    {t.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Custom Goal */}
        <div>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
            Custom Goal <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
          </label>
          <input
            style={{
              width: "100%", padding: "12px 16px",
              background: "var(--bg-card)", border: "1.5px solid var(--border)",
              borderRadius: 10, color: "var(--text-primary)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              transition: "border-color 0.2s ease",
            }}
            placeholder='e.g. "Get 50 pre-orders for our new collection"'
            value={customGoal}
            onChange={e => onGoalChange(e.target.value)}
            onFocus={e => (e.target.style.borderColor = "var(--gold)")}
            onBlur={e => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <motion.button
          onClick={onNext}
          disabled={!valid}
          whileHover={valid ? { scale: 1.02 } : {}}
          whileTap={valid ? { scale: 0.98 } : {}}
          style={{
            padding: "14px 48px", borderRadius: 12, border: "none", cursor: valid ? "pointer" : "not-allowed",
            background: valid ? "linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)" : "var(--border)",
            color: valid ? "#1a1000" : "var(--text-muted)",
            fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
            boxShadow: valid ? "0 4px 20px rgba(212,151,59,0.3)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          Generate Campaign ✦
        </motion.button>
      </div>
    </motion.div>
  );
}
