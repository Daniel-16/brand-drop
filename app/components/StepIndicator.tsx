"use client";
import { motion } from "framer-motion";

const STEPS = [
  { n: 1, label: "Business Info" },
  { n: 2, label: "Brand DNA" },
  { n: 3, label: "Campaign Setup" },
  { n: 4, label: "Results" },
];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((step, i) => {
        const done = current > step.n;
        const active = current === step.n;
        return (
          <div key={step.n} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                initial={false}
                animate={{
                  scale: active ? 1 : 0.85,
                  opacity: done || active ? 1 : 0.35,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative flex items-center justify-center"
              >
                <div
                  style={{
                    width: 36, height: 36,
                    borderRadius: "50%",
                    border: `1.5px solid ${active ? "var(--gold)" : done ? "var(--gold-dim)" : "var(--border-light)"}`,
                    background: active ? "rgba(212,151,59,0.12)" : done ? "rgba(212,151,59,0.06)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: active ? "var(--gold)" : "var(--text-muted)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{step.n}</span>
                  )}
                </div>
                {active && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ border: "1px solid var(--gold)" }}
                    animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <span style={{
                fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase",
                color: active ? "var(--gold)" : done ? "var(--text-muted)" : "var(--text-muted)",
                opacity: done || active ? 1 : 0.5,
                whiteSpace: "nowrap",
              }}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: 60, height: 1,
                background: `linear-gradient(to right, ${done ? "var(--gold-dim)" : "var(--border)"}, ${current > step.n + 1 ? "var(--gold-dim)" : "var(--border)"})`,
                margin: "0 8px", marginBottom: 20, flexShrink: 0,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
