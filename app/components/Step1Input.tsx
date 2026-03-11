"use client";
import { motion } from "framer-motion";
import { Upload, ImageIcon, X } from "lucide-react";
import { useRef, useState } from "react";

const INDUSTRIES = [
  "Fashion & Apparel", "Food & Beverage", "Beauty & Cosmetics",
  "Retail & E-commerce", "Logistics & Delivery", "Technology",
  "Health & Wellness", "Photography", "Interior Design",
  "Events & Entertainment", "Education", "Finance",
];

interface Props {
  data: { businessName: string; industry: string; description: string; image: File | null; preview: string };
  onChange: (data: Partial<Props["data"]>) => void;
  onNext: () => void;
}

export default function Step1Input({ data, onChange, onNext }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange({ image: file, preview: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const valid = data.businessName.trim() && data.industry && data.description.trim() && data.image;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px",
    background: "var(--bg-card)", border: "1.5px solid var(--border)",
    borderRadius: 10, color: "var(--text-primary)",
    fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    transition: "border-color 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600,
    letterSpacing: "0.08em", textTransform: "uppercase",
    color: "var(--text-muted)", marginBottom: 8,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 600, marginBottom: 10 }}>
          Tell us about your <span className="text-gold-gradient">business</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
          Drop a photo and a few details — we'll handle the rest
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, maxWidth: 840, margin: "0 auto" }}>
        {/* Left: Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={labelStyle}>Business Name</label>
            <input
              style={inputStyle}
              placeholder="e.g. Adunni Couture"
              value={data.businessName}
              onChange={e => onChange({ businessName: e.target.value })}
              onFocus={e => (e.target.style.borderColor = "var(--gold)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>

          <div>
            <label style={labelStyle}>Industry</label>
            <select
              style={{ ...inputStyle, cursor: "pointer", appearance: "none" as const }}
              value={data.industry}
              onChange={e => onChange({ industry: e.target.value })}
              onFocus={e => (e.target.style.borderColor = "var(--gold)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            >
              <option value="">Select industry...</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Business Description</label>
            <textarea
              style={{ ...inputStyle, minHeight: 110, resize: "vertical" as const, lineHeight: 1.6 }}
              placeholder="Describe what you sell, who your customers are, and what makes you unique..."
              value={data.description}
              onChange={e => onChange({ description: e.target.value })}
              onFocus={e => (e.target.style.borderColor = "var(--gold)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>

        {/* Right: Image Upload */}
        <div>
          <label style={labelStyle}>Brand Image</label>
          <motion.div
            onClick={() => !data.image && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            animate={{ borderColor: dragOver ? "var(--gold)" : data.preview ? "var(--gold-dim)" : "var(--border-light)" }}
            style={{
              border: `2px dashed var(--border-light)`,
              borderRadius: 14,
              overflow: "hidden",
              cursor: data.image ? "default" : "pointer",
              aspectRatio: "1",
              position: "relative",
              background: "var(--bg-card)",
              transition: "all 0.2s ease",
            }}
            whileHover={!data.image ? { borderColor: "var(--gold-dim)", background: "var(--bg-card-hover)" } : {}}
          >
            {data.preview ? (
              <>
                <img src={data.preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                }} />
                <button
                  onClick={e => { e.stopPropagation(); onChange({ image: null, preview: "" }); }}
                  style={{
                    position: "absolute", top: 10, right: 10,
                    background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "50%", width: 30, height: 30, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white",
                  }}
                >
                  <X size={14} />
                </button>
                <div style={{
                  position: "absolute", bottom: 12, left: 12,
                  fontSize: 12, color: "rgba(255,255,255,0.8)",
                }}>
                  <ImageIcon size={12} style={{ display: "inline", marginRight: 6 }} />
                  {data.image?.name}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{
                    position: "absolute", bottom: 12, right: 12,
                    background: "rgba(212,151,59,0.2)", border: "1px solid var(--gold)",
                    borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer",
                    color: "var(--gold)", fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Change
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 24 }}>
                <motion.div
                  animate={dragOver ? { scale: 1.15 } : { scale: 1 }}
                  style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: "rgba(212,151,59,0.08)", border: "1.5px solid var(--border-light)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Upload size={22} style={{ color: "var(--gold)" }} />
                </motion.div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>
                    Drop your image here
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Logo, product photo, or storefront
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, opacity: 0.6 }}>
                    JPG, PNG, WEBP up to 10MB
                  </p>
                </div>
                <div style={{
                  padding: "8px 20px", borderRadius: 8,
                  background: "rgba(212,151,59,0.08)", border: "1px solid var(--gold-dim)",
                  fontSize: 12, color: "var(--gold)", fontWeight: 500,
                }}>
                  Browse Files
                </div>
              </div>
            )}
          </motion.div>
          <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      </div>

      {/* CTA */}
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
            letterSpacing: "0.02em", transition: "all 0.3s ease",
            boxShadow: valid ? "0 4px 20px rgba(212,151,59,0.3)" : "none",
          }}
        >
          Extract Brand DNA →
        </motion.button>
        {!valid && (
          <p style={{ marginTop: 10, fontSize: 12, color: "var(--text-muted)" }}>
            Fill all fields and upload an image to continue
          </p>
        )}
      </div>
    </motion.div>
  );
}
