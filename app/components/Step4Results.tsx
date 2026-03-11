"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Copy, Check, Download, Instagram, Facebook, MessageCircle, ImageIcon } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface Content {
  instagram?: { bio: string; caption: string; hashtags: string[] } | null;
  facebook?: { bio: string; caption: string; hashtags: string[] } | null;
  whatsapp?: { statusCaption: string; broadcastMessage: string } | null;
}

interface Props {
  content: Content;
  imageBase64: string;
  businessName: string;
  platforms: string[];
  onRestart: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <motion.button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: "6px 12px", borderRadius: 7, border: "1px solid var(--border-light)",
        background: copied ? "rgba(76,175,125,0.1)" : "var(--bg-card-hover)",
        color: copied ? "#4CAF7D" : "var(--text-muted)", cursor: "pointer",
        fontSize: 12, display: "flex", alignItems: "center", gap: 5,
        fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease",
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </motion.button>
  );
}

function ContentBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</span>
        <CopyButton text={value} />
      </div>
      <div style={{
        padding: "14px 16px", borderRadius: 10,
        background: "var(--bg-secondary)", border: "1px solid var(--border)",
        fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7,
        whiteSpace: "pre-wrap",
      }}>
        {value}
      </div>
    </div>
  );
}

const TAB_CONFIG = [
  { value: "instagram", label: "Instagram", icon: Instagram, color: "#E1306C" },
  { value: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366" },
];

export default function Step4Results({ content, imageBase64, businessName, platforms, onRestart }: Props) {
  const availableTabs = TAB_CONFIG.filter(t => platforms.includes(t.value));
  const [activeTab, setActiveTab] = useState(availableTabs[0]?.value || "instagram");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder(businessName.replace(/\s+/g, "_")) || zip;

      if (content.instagram) {
        const ig = content.instagram;
        folder.file("instagram.txt", `=== INSTAGRAM ===\n\nBIO:\n${ig.bio}\n\nCAPTION:\n${ig.caption}\n\nHASHTAGS:\n${ig.hashtags.join(" ")}`);
      }
      if (content.facebook) {
        const fb = content.facebook;
        folder.file("facebook.txt", `=== FACEBOOK ===\n\nBIO:\n${fb.bio}\n\nCAPTION:\n${fb.caption}\n\nHASHTAGS:\n${fb.hashtags.join(" ")}`);
      }
      if (content.whatsapp) {
        const wa = content.whatsapp;
        folder.file("whatsapp.txt", `=== WHATSAPP ===\n\nSTATUS:\n${wa.statusCaption}\n\nBROADCAST MESSAGE:\n${wa.broadcastMessage}`);
      }

      if (imageBase64) {
        const imgData = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        folder.file("campaign_image.jpg", imgData, { base64: true });
      }

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `BrandDrop_${businessName.replace(/\s+/g, "_")}_Campaign.zip`);
    } finally {
      setDownloading(false);
    }
  };

  const activeContent = content[activeTab as keyof Content];
  const activeTabConfig = TAB_CONFIG.find(t => t.value === activeTab)!;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px",
            borderRadius: 100, background: "rgba(212,151,59,0.1)", border: "1px solid rgba(212,151,59,0.3)",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 14 }}>✦</span>
          <span style={{ fontSize: 12, color: "var(--gold)", fontWeight: 500 }}>Campaign Generated</span>
        </motion.div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 600, marginBottom: 8 }}>
          Your <span className="text-gold-gradient">{businessName}</span> campaign kit
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Preview your content below, then download everything as a ZIP
        </p>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>
        {/* Content Panel */}
        <div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 24, padding: "4px", background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)" }}>
            {availableTabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.value;
              return (
                <motion.button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    flex: 1, padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer",
                    background: active ? "var(--bg-card-hover)" : "transparent",
                    color: active ? "var(--text-primary)" : "var(--text-muted)",
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease",
                    boxShadow: active ? "0 1px 4px rgba(0,0,0,0.4)" : "none",
                  }}
                >
                  <Icon size={14} style={{ color: active ? tab.color : "inherit" }} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: 16, padding: 24,
              }}
            >
              {/* Platform header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${activeTabConfig.color}15`, border: `1px solid ${activeTabConfig.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <activeTabConfig.icon size={16} style={{ color: activeTabConfig.color }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{activeTabConfig.label} Content</h3>
              </div>

              {activeTab === "instagram" && content.instagram && (
                <>
                  <ContentBlock label="Bio" value={content.instagram.bio} />
                  <ContentBlock label="Caption" value={content.instagram.caption} />
                  <ContentBlock label="Hashtags" value={content.instagram.hashtags.join(" ")} />
                </>
              )}
              {activeTab === "facebook" && content.facebook && (
                <>
                  <ContentBlock label="Page Bio" value={content.facebook.bio} />
                  <ContentBlock label="Caption" value={content.facebook.caption} />
                  <ContentBlock label="Hashtags" value={content.facebook.hashtags.join(" ")} />
                </>
              )}
              {activeTab === "whatsapp" && content.whatsapp && (
                <>
                  <ContentBlock label="Status Caption" value={content.whatsapp.statusCaption} />
                  <ContentBlock label="Broadcast Message" value={content.whatsapp.broadcastMessage} />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Image + Download */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Campaign Image */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                <ImageIcon size={12} /> Campaign Image
              </span>
            </div>
            {imageBase64 ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`}
                alt="Campaign"
                style={{ width: "100%", borderRadius: 12, aspectRatio: "1", objectFit: "cover" }}
              />
            ) : (
              <div style={{ aspectRatio: "1", borderRadius: 12, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Image unavailable</span>
              </div>
            )}
          </div>

          {/* Download button */}
          <motion.button
            onClick={handleDownload}
            disabled={downloading}
            whileHover={!downloading ? { scale: 1.02 } : {}}
            whileTap={!downloading ? { scale: 0.98 } : {}}
            style={{
              padding: "15px 20px", borderRadius: 12, border: "none", cursor: downloading ? "wait" : "pointer",
              background: "linear-gradient(135deg, var(--gold) 0%, var(--amber) 100%)",
              color: "#1a1000", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 20px rgba(212,151,59,0.35)",
            }}
          >
            <Download size={16} />
            {downloading ? "Preparing ZIP..." : "Download ZIP"}
          </motion.button>

          {/* Restart */}
          <button
            onClick={onRestart}
            style={{
              padding: "11px 20px", borderRadius: 10, cursor: "pointer",
              border: "1px solid var(--border-light)",
              background: "transparent", color: "var(--text-muted)",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            }}
          >
            ← Start New Campaign
          </button>
        </div>
      </div>
    </motion.div>
  );
}
