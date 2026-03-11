"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";

/* ─── Tiny hook: count-up animation ─── */
function useCountUp(target: number, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

/* ─── Scroll-reveal wrapper ─── */
function Reveal({ children, delay = 0, direction = "up" }: {
  children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : 0,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(value, 2000, inView);
  return (
    <Reveal delay={delay}>
      <div ref={ref} style={{
        padding: "28px 32px", borderRadius: 16,
        background: "var(--bg-card)", border: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, lineHeight: 1,
          background: "linear-gradient(135deg, var(--gold-light), var(--gold), var(--amber))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          {count}{suffix}
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.04em" }}>{label}</div>
      </div>
    </Reveal>
  );
}

/* ─── Step card for How It Works ─── */
function HowItWorksCard({ n, title, desc, delay }: { n: string; title: string; desc: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div style={{
        padding: "32px 28px", borderRadius: 18,
        background: "var(--bg-card)", border: "1px solid var(--border)",
        position: "relative", overflow: "hidden",
        transition: "border-color 0.3s ease, transform 0.3s ease",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--gold-dim)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Large background number */}
        <div style={{
          position: "absolute", top: -10, right: 16,
          fontFamily: "'Playfair Display', serif", fontSize: 120, fontWeight: 700, lineHeight: 1,
          color: "rgba(212,151,59,0.04)", userSelect: "none", pointerEvents: "none",
        }}>{n}</div>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(212,151,59,0.08)", border: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
          color: "var(--gold)", marginBottom: 20,
        }}>{n}</div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
        <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>{desc}</p>
      </div>
    </Reveal>
  );
}

/* ─── Feature row ─── */
function FeatureRow({ icon, title, desc, reverse = false, delay = 0 }: {
  icon: string; title: string; desc: string; reverse?: boolean; delay?: number;
}) {
  return (
    <Reveal delay={delay} direction={reverse ? "right" : "left"}>
      <div style={{
        display: "flex", gap: 20, alignItems: "flex-start",
        flexDirection: reverse ? "row-reverse" : "row",
        padding: "20px 0", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: "rgba(212,151,59,0.07)", border: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>{icon}</div>
        <div>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{title}</h4>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, maxWidth: 340 }}>{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Animated brand tag ─── */
const FLOATING_TAG_TRANSITIONS = [
  { duration: 3 + Math.random() * 2, delay: Math.random() * 2 },
  { duration: 3 + Math.random() * 2, delay: Math.random() * 2 },
  { duration: 3 + Math.random() * 2, delay: Math.random() * 2 },
  { duration: 3 + Math.random() * 2, delay: Math.random() * 2 },
  { duration: 3 + Math.random() * 2, delay: Math.random() * 2 },
  { duration: 3 + Math.random() * 2, delay: Math.random() * 2 },
];

function FloatingTag(
  { text, color, style, duration, delay }: {
    text: string; color: string; style: React.CSSProperties;
    duration?: number; delay?: number;
  }
) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: duration ?? 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay ?? 1,
      }}
      style={{
        position: "absolute",
        padding: "6px 14px", borderRadius: 100,
        background: `${color}15`, border: `1px solid ${color}40`,
        fontSize: 12, color, fontWeight: 500, whiteSpace: "nowrap",
        backdropFilter: "blur(8px)",
        ...style,
      }}
    >
      {text}
    </motion.div>
  );
}

/* ─── Testimonial card ─── */
function Testimonial({ quote, name, role, delay }: { quote: string; name: string; role: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <div style={{
        padding: "28px", borderRadius: 16,
        background: "var(--bg-card)", border: "1px solid var(--border)",
      }}>
        <div style={{ fontSize: 28, color: "var(--gold)", marginBottom: 14, fontFamily: "Georgia, serif" }}>&quot;</div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 20 }}>{quote}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold-dim), var(--amber))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#1a1000",
          }}>{name[0]}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{name}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{role}</div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Marquee ─── */
const MARQUEE_ITEMS = [
  "Brand DNA Extraction", "Instagram Captions", "Facebook Copy",
  "WhatsApp Broadcasts", "Campaign Image", "Hashtag Strategy",
  "Brand Voice", "Color Palette", "60-Second Kit",
];

function Marquee() {
  return (
    <div style={{ overflow: "hidden", padding: "18px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", margin: "0", background: "var(--bg-secondary)" }}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 40, width: "max-content", alignItems: "center" }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={i} style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "var(--gold)", fontSize: 8 }}>✦</span>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "0 40px", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(8,7,5,0.85)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: "linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1000" }}>B</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 600 }}>
            Brand<span style={{
              background: "linear-gradient(135deg, var(--gold-light), var(--gold))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Drop</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Features", "How It Works", "Pricing"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", letterSpacing: "0.02em", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
            >{item}</a>
          ))}
        </div>

        <Link href="/app">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "9px 22px", borderRadius: 9, border: "1px solid var(--gold-dim)",
              background: "rgba(212,151,59,0.08)", color: "var(--gold)",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em",
              transition: "all 0.2s ease",
            }}
          >
            Launch App →
          </motion.button>
        </Link>
      </motion.nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: 64, overflow: "hidden" }}>

        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(212,151,59,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,151,59,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }} />

        {/* Radial glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,151,59,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Floating tags around hero */}
        <FloatingTag text="✦ Brand Voice" color="#D4973B" style={{ top: "22%", left: "8%" }} {...FLOATING_TAG_TRANSITIONS[0]} />
        <FloatingTag text="Color Palette 🎨" color="#E8B86A" style={{ top: "35%", left: "5%" }} {...FLOATING_TAG_TRANSITIONS[1]} />
        <FloatingTag text="Instagram Ready" color="#E1306C" style={{ top: "20%", right: "7%" }} {...FLOATING_TAG_TRANSITIONS[2]} />
        <FloatingTag text="⚡ 60 Seconds" color="#4CAF7D" style={{ top: "38%", right: "6%" }} {...FLOATING_TAG_TRANSITIONS[3]} />
        <FloatingTag text="WhatsApp Broadcast" color="#25D366" style={{ bottom: "28%", left: "7%" }} {...FLOATING_TAG_TRANSITIONS[4]} />
        <FloatingTag text="Personality Tags" color="#9B6B22" style={{ bottom: "30%", right: "8%" }} {...FLOATING_TAG_TRANSITIONS[5]} />

        {/* Hero content */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="hero-content" >
          <div style={{ textAlign: "center", maxWidth: 820, padding: "0 24px", position: "relative", zIndex: 2 }}>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "7px 18px", borderRadius: 100, marginBottom: 32,
                background: "rgba(212,151,59,0.08)", border: "1px solid rgba(212,151,59,0.25)",
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--gold)", display: "inline-block" }}
              />
              <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 500, letterSpacing: "0.06em" }}>
                Powered by Gemini 3.1 · Now Live
              </span>
            </motion.div>

            {/* Headline */}
            <div style={{ overflow: "hidden", marginBottom: 8 }}>
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(44px, 7vw, 86px)",
                  fontWeight: 700, lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                }}
              >
                Your brand kit,
              </motion.h1>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 28 }}>
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(44px, 7vw, 86px)",
                  fontWeight: 700, lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 40%, var(--amber) 80%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}
              >
                in 60 seconds.
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              style={{
                fontSize: "clamp(15px, 2vw, 18px)", color: "var(--text-secondary)",
                lineHeight: 1.7, maxWidth: 540, margin: "0 auto 44px",
              }}
            >
              Drop one photo. Get a complete brand identity — colors, voice, captions for Instagram, Facebook & WhatsApp. Zero design skills needed.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
            >
              <Link href="/app">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(212,151,59,0.45)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "15px 36px", borderRadius: 12, border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)",
                    color: "#1a1000", fontSize: 15, fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.01em",
                    boxShadow: "0 4px 24px rgba(212,151,59,0.3)",
                  }}
                >
                  Generate My Brand Kit →
                </motion.button>
              </Link>
              <a href="#how-it-works" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.03, borderColor: "var(--border-light)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "15px 32px", borderRadius: 12, cursor: "pointer",
                    border: "1px solid var(--border)", background: "transparent",
                    color: "var(--text-secondary)", fontSize: 15, fontWeight: 500,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  See How It Works
                </motion.button>
              </a>
            </motion.div>

            {/* Social proof nudge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              style={{ marginTop: 24, fontSize: 12, color: "var(--text-muted)" }}
            >
              No account needed · Free to try · Instant results
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: 1, height: 30, background: "linear-gradient(to bottom, var(--gold-dim), transparent)" }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── STATS ── */}
      <section style={{ padding: "80px 40px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          <StatCard value={60} suffix="s" label="Average generation time" delay={0} />
          <StatCard value={3} suffix="+" label="Platforms in one kit" delay={0.1} />
          <StatCard value={12} suffix="+" label="Industries supported" delay={0.2} />
          <StatCard value={100} suffix="%" label="AI-generated, zero effort" delay={0.3} />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>
              The Process
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Four steps to a full<br />
              <span style={{
                background: "linear-gradient(135deg, var(--gold-light), var(--gold))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                fontStyle: "italic",
              }}>brand campaign kit</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          <HowItWorksCard n="1" title="Upload your image" desc="Drop a product photo, logo, or storefront shot. That's all we need to get started." delay={0.05} />
          <HowItWorksCard n="2" title="AI extracts Brand DNA" desc="Gemini Vision reads your image and extracts your color palette, brand voice, personality, and visual style." delay={0.15} />
          <HowItWorksCard n="3" title="Configure your campaign" desc="Pick your platforms — Instagram, Facebook, WhatsApp — and choose a campaign theme that fits your moment." delay={0.25} />
          <HowItWorksCard n="4" title="Download your kit" desc="Get studio-quality copy, hashtags, and a campaign image — all bundled in a single ZIP file, ready to post." delay={0.35} />
        </div>

        {/* Connector arrows */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <Link href="/app">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 6px 28px rgba(212,151,59,0.35)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "13px 32px", borderRadius: 11, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)",
                color: "#1a1000", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                boxShadow: "0 4px 20px rgba(212,151,59,0.25)",
              }}
            >
              Try It Now — Free →
            </motion.button>
          </Link>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "80px 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            {/* Left: Features list */}
            <div>
              <Reveal>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>
                  What You Get
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 40 }}>
                  Everything your brand needs to{" "}
                  <span style={{ fontStyle: "italic", color: "var(--gold)" }}>show up</span> online
                </h2>
              </Reveal>

              <FeatureRow icon="🎨" title="Brand DNA Extraction" desc="AI reads your image and maps out your exact colors, typography mood, visual style, and personality." delay={0.05} />
              <FeatureRow icon="📸" title="AI Campaign Image" desc="A text-free, studio-quality 1:1 image generated to match your extracted brand style. Ready for Instagram." delay={0.1} />
              <FeatureRow icon="✍️" title="Platform-Specific Copy" desc="Captions written differently for each platform — Instagram's story format, Facebook's community tone, WhatsApp's personal warmth." delay={0.15} />
              <FeatureRow icon="📦" title="One-Click ZIP Download" desc="Every asset — copy, hashtags, image — bundled into a single ZIP file organized by platform." delay={0.2} />
            </div>

            {/* Right: Mock UI card */}
            <Reveal direction="right" delay={0.2}>
              <div style={{ position: "relative" }}>
                {/* Shadow cards behind */}
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 20, transform: "rotate(3deg) translate(12px, 12px)",
                  background: "var(--bg-card)", border: "1px solid var(--border)", zIndex: 0,
                }} />
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 20, transform: "rotate(-2deg) translate(-8px, 8px)",
                  background: "var(--bg-card)", border: "1px solid var(--border)", zIndex: 0,
                }} />

                {/* Main card */}
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: "relative", zIndex: 1,
                    background: "var(--bg-card)", border: "1px solid var(--border-light)",
                    borderRadius: 20, padding: 28, overflow: "hidden",
                  }}
                >
                  {/* Card header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Brand DNA</span>
                    <div style={{
                      padding: "4px 12px", borderRadius: 100,
                      background: "rgba(76,175,125,0.1)", border: "1px solid rgba(76,175,125,0.3)",
                      fontSize: 11, color: "#4CAF7D",
                    }}>Extracted ✓</div>
                  </div>

                  {/* Color swatches */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    {["#2C1810", "#8B4513", "#D4973B"].map((c, i) => (
                      <motion.div
                        key={c}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
                        style={{
                          flex: 1, height: 52, borderRadius: 10,
                          background: c, boxShadow: `0 6px 16px ${c}66`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
                    {["Warm & Inviting", "Artisan", "Authentic", "Local Pride"].map((t, i) => (
                      <motion.span
                        key={t}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 + 0.5 }}
                        style={{
                          padding: "4px 12px", borderRadius: 100, fontSize: 11,
                          background: "rgba(212,151,59,0.07)", border: "1px solid var(--border-light)",
                          color: "var(--text-secondary)",
                        }}
                      >{t}</motion.span>
                    ))}
                  </div>

                  {/* Caption preview */}
                  <div style={{
                    padding: "14px 16px", borderRadius: 10,
                    background: "var(--bg-secondary)", border: "1px solid var(--border)",
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>Instagram Caption</p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                      The aroma before the first sip. Our handcrafted blends are made for mornings worth remembering ☕✨
                    </p>
                    <p style={{ fontSize: 11, color: "var(--gold-dim)", marginTop: 8 }}>#LocalCoffee #ArtisanBlend #NigerianCoffee</p>
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOR WHO ── */}
      <section style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>Built For</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Who is BrandDrop for?
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { icon: "👗", title: "Fashion & Apparel", desc: "Drop a product photo and get a complete launch kit for your new collection — Instagram-ready in under a minute.", delay: 0.05 },
            { icon: "🍔", title: "Food & Beverage", desc: "From suya spot to bakery — create mouthwatering captions and a campaign image that makes people hungry.", delay: 0.15 },
            { icon: "💄", title: "Beauty & Cosmetics", desc: "Nail your brand voice and get aesthetically-aligned copy that speaks directly to your target audience.", delay: 0.25 },
            { icon: "📦", title: "Retail & E-commerce", desc: "Flash sale? New launch? Generate a full platform kit for any campaign theme in seconds.", delay: 0.05 },
            { icon: "🚚", title: "Logistics & Delivery", desc: "Build trust with consistent, professional branding across every platform where your customers find you.", delay: 0.15 },
            { icon: "📱", title: "Social Media Managers", desc: "Prototype full campaign kits for clients in minutes. Impress with AI-powered brand analysis on every pitch.", delay: 0.25 },
          ].map(card => (
            <Reveal key={card.title} delay={card.delay}>
              <motion.div
                whileHover={{ y: -4, borderColor: "var(--border-light)" }}
                transition={{ duration: 0.25 }}
                style={{
                  padding: "26px 24px", borderRadius: 16,
                  background: "var(--bg-card)", border: "1px solid var(--border)",
                  cursor: "default",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 14 }}>{card.icon}</div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{card.title}</h4>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65 }}>{card.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "80px 0", background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 40px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>Testimonials</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, lineHeight: 1.1 }}>
                Brands love it
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            <Testimonial delay={0.05} quote="I used to spend hours writing captions and still wasn't happy with them. BrandDrop gave me a complete Instagram kit in literally one minute. The colors it picked were exactly right for my clothing line." name="Temi A." role="Fashion SMB · Lagos" />
            <Testimonial delay={0.15} quote="As a freelance social media manager, this tool changed how I do client pitches. I generate a Brand DNA sample during the meeting and clients are blown away every time." name="Kelechi O." role="Social Media Manager · Abuja" />
            <Testimonial delay={0.25} quote="My WhatsApp broadcast message from BrandDrop got more replies than anything I've written myself. The tone was spot-on — personal, warm, and direct. My customers felt spoken to." name="Fatima B." role="Beauty & Cosmetics · Kano" />
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "80px 40px", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>Pricing</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
            Simple, honest pricing
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 48 }}>Coming soon with premium tiers. For now — completely free.</p>
        </Reveal>

        <Reveal delay={0.15}>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: "48px 40px", borderRadius: 20,
              background: "var(--bg-card)", border: "1px solid var(--border-light)",
              position: "relative", overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Background accent */}
            <div style={{
              position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,151,59,0.06) 0%, transparent 70%)",
            }} />

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px",
              borderRadius: 100, background: "rgba(76,175,125,0.1)", border: "1px solid rgba(76,175,125,0.3)",
              marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4CAF7D", display: "inline-block" }} />
              <span style={{ fontSize: 12, color: "#4CAF7D", fontWeight: 500 }}>MVP — Free Access</span>
            </div>

            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 64, fontWeight: 700, lineHeight: 1,
              background: "linear-gradient(135deg, var(--gold-light), var(--gold), var(--amber))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 8,
            }}>₦0</div>
            <p style={{ color: "var(--text-muted)", marginBottom: 36, fontSize: 14 }}>Full access during MVP. No card required.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36, textAlign: "left" }}>
              {[
                "Brand DNA Extraction", "AI Campaign Image",
                "Instagram Content Kit", "Facebook Content Kit",
                "WhatsApp Broadcast", "ZIP Download",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#4CAF7D", fontSize: 14 }}>✓</span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{f}</span>
                </div>
              ))}
            </div>

            <Link href="/app">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(212,151,59,0.4)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%", padding: "15px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)",
                  color: "#1a1000", fontSize: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 20px rgba(212,151,59,0.3)",
                }}
              >
                Start For Free →
              </motion.button>
            </Link>
          </motion.div>
        </Reveal>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "0 40px 100px", textAlign: "center" }}>
        <Reveal>
          <div style={{
            maxWidth: 860, margin: "0 auto", padding: "72px 48px", borderRadius: 24,
            background: "linear-gradient(135deg, rgba(212,151,59,0.06) 0%, rgba(196,123,43,0.04) 100%)",
            border: "1px solid rgba(212,151,59,0.2)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(rgba(212,151,59,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,151,59,0.03) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ fontSize: 36, marginBottom: 20, display: "inline-block" }}
              >
                ✦
              </motion.div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.1,
                letterSpacing: "-0.02em", marginBottom: 16,
              }}>
                Your brand deserves to{" "}
                <span style={{
                  background: "linear-gradient(135deg, var(--gold-light), var(--gold))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  fontStyle: "italic",
                }}>look the part.</span>
              </h2>
              <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 36, maxWidth: 460, margin: "0 auto 36px" }}>
                One photo. One minute. A complete campaign kit ready to post — on every platform your customers use.
              </p>
              <Link href="/app">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 10px 40px rgba(212,151,59,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "16px 44px", borderRadius: 13, border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)",
                    color: "#1a1000", fontSize: 16, fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 6px 28px rgba(212,151,59,0.35)",
                  }}
                >
                  Generate My Brand Kit — Free →
                </motion.button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "28px 40px", borderTop: "1px solid var(--border)",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: "linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#1a1000" }}>B</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600 }}>
            Brand<span style={{
              background: "linear-gradient(135deg, var(--gold-light), var(--gold))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Drop</span>
          </span>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Powered by <span style={{ color: "var(--gold)" }}>Gemini 3.1</span> · Built for Nigerian SMBs · © {new Date().getFullYear()} BrandDrop
        </p>
        <Link href="/app">
          <span style={{ fontSize: 12, color: "var(--gold)", cursor: "pointer" }}>Launch App →</span>
        </Link>
      </footer>
    </div>
  );
}
