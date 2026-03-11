"use client";
import { motion } from "framer-motion";

const MESSAGES: Record<string, string[]> = {
  brand: [
    "Reading visual signals...",
    "Extracting color palette...",
    "Mapping brand personality...",
    "Analyzing typography cues...",
    "Building your Brand DNA...",
  ],
  content: [
    "Crafting Instagram copy...",
    "Writing Facebook content...",
    "Composing WhatsApp message...",
    "Generating campaign image...",
    "Polishing final assets...",
  ],
};

export default function LoadingScreen({ type }: { type: "brand" | "content" }) {
  const msgs = MESSAGES[type];
  const title = type === "brand" ? "Extracting Brand DNA" : "Crafting Your Campaign";
  const subtitle = type === "brand"
    ? "Our AI is reading between the pixels"
    : "Building your full platform kit";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] gap-10"
    >
      {/* Orbital loader */}
      <div className="relative w-28 h-28">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid var(--border-light)" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid transparent", borderTopColor: "var(--gold)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute"
          style={{ inset: 10, borderRadius: "50%", border: "1px solid transparent", borderTopColor: "var(--gold-dim)", borderRightColor: "var(--gold-dim)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        {/* Center dot */}
        <motion.div
          className="absolute"
          style={{
            inset: "50%", width: 8, height: 8, borderRadius: "50%",
            background: "var(--gold)", marginLeft: -4, marginTop: -4,
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Particle dots on orbit */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: 3, height: 3, borderRadius: "50%",
              background: "var(--gold)", top: "50%", left: "50%",
              marginLeft: -1.5, marginTop: -1.5,
              transformOrigin: "1.5px 1.5px",
            }}
            animate={{ rotate: [deg, deg + 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
            initial={{ x: 46, opacity: i % 2 === 0 ? 0.8 : 0.3 }}
          />
        ))}
      </div>

      <div className="text-center">
        <motion.h2
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, marginBottom: 8 }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {title}
        </motion.h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{subtitle}</p>
      </div>

      {/* Cycling messages */}
      <div style={{ height: 24, position: "relative", overflow: "hidden", width: 280 }}>
        {msgs.map((msg, i) => (
          <motion.p
            key={msg}
            style={{
              position: "absolute", width: "100%", textAlign: "center",
              fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.02em",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [10, 0, 0, -10],
            }}
            transition={{
              duration: 2.5,
              delay: i * 2.2,
              repeat: Infinity,
              repeatDelay: msgs.length * 2.2 - 2.5,
              times: [0, 0.15, 0.7, 1],
            }}
          >
            {msg}
          </motion.p>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        width: 240, height: 2,
        background: "var(--border)",
        borderRadius: 2, overflow: "hidden",
      }}>
        <motion.div
          style={{ height: "100%", background: "linear-gradient(to right, var(--gold-dim), var(--gold))" }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
