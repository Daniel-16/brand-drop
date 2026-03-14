"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StepIndicator from "../components/StepIndicator";
import Step1Input from "../components/Step1Input";
import Step2BrandDNA from "../components/Step2BrandDNA";
import Step3Campaign from "../components/Step3Campaign";
import Step4Results from "../components/Step4Results";
import LoadingScreen from "../components/LoadingScreen";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Step = 1 | 2 | 3 | 4;
type LoadingType = "brand" | "content" | null;

interface BrandDNA {
  primaryColor: string; secondaryColor: string; accentColor: string;
  typographyStyle: string; typographyMood: string; brandVoice: string;
  targetAudience: string; personalityTags: string[]; visualStyle: string;
  brandEmotion: string; colorRationale: string;
}

interface Content {
  instagram?: { bio: string; caption: string; hashtags: string[] } | null;
  facebook?: { bio: string; caption: string; hashtags: string[] } | null;
  whatsapp?: { statusCaption: string; broadcastMessage: string } | null;
}

function toBase64(dataUrl: string) {
  return dataUrl.split(",")[1] || "";
}

function getMimeType(dataUrl: string) {
  return dataUrl.split(";")[0].split(":")[1] || "image/jpeg";
}

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState<LoadingType>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setImageError] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: "", industry: "", description: "",
    image: null as File | null, preview: "",
  });

  const [brandDNA, setBrandDNA] = useState<BrandDNA | null>(null);

  const [platforms, setPlatforms] = useState<string[]>(["instagram"]);
  const [campaignTheme, setCampaignTheme] = useState("");
  const [customGoal, setCustomGoal] = useState("");

  const [content, setContent] = useState<Content | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");

  const handleAnalyzeBrand = async () => {
    setError(null);
    setLoading("brand");
    try {
      const res = await fetch("/api/analyze-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: toBase64(formData.preview),
          mimeType: getMimeType(formData.preview),
          businessName: formData.businessName,
          industry: formData.industry,
          description: formData.description,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Analysis failed");
      setBrandDNA(data.brandDNA);
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateCampaign = async () => {
    if (!brandDNA) return;
    setError(null);
    setLoading("content");
    try {
      const [contentRes, imageRes] = await Promise.allSettled([
        fetch("/api/generate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brandDNA, businessName: formData.businessName, industry: formData.industry,
            description: formData.description, platforms, campaignTheme, customGoal,
          }),
        }).then(r => r.json()),
        fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brandDNA, businessName: formData.businessName, industry: formData.industry,
            campaignTheme, imageBase64: toBase64(formData.preview),
            mimeType: getMimeType(formData.preview),
          }),
        }).then(r => r.json()),
      ]);

      if (contentRes.status === "rejected" || !contentRes.value.success) {
        throw new Error(contentRes.status === "rejected" ? contentRes.reason : contentRes.value.error);
      }

      setContent(contentRes.value.content);
      if (imageRes.status === "fulfilled" && imageRes.value.success) {
        setImageBase64(imageRes.value.imageBase64);
      } else {
        setImageError(true);
      }
      setStep(4);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(null);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setFormData({ businessName: "", industry: "", description: "", image: null, preview: "" });
    setBrandDNA(null);
    setPlatforms(["instagram"]);
    setCampaignTheme("");
    setCustomGoal("");
    setContent(null);
    setImageBase64("");
    setError(null);
  };

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  // const displayStep = loading ? (loading === "brand" ? 1.5 : 3.5) : step;
  // const indicatorStep = loading === "brand" ? 2 : loading === "content" ? 4 : step;

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,151,59,0.04) 0%, transparent 70%)",
          top: -100, right: -100,
        }} />
        <div style={{
          position: "absolute", width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,123,43,0.03) 0%, transparent 70%)",
          bottom: -50, left: -100,
        }} />
      </div>

        <Header />     

      {/* Main content */}
      <main style={{ position: "relative", zIndex: 5, padding: "60px 40px", maxWidth: 1100, margin: "0 auto" }}>
        {!loading && step < 4 && (
          <StepIndicator current={step} />
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: "14px 20px", borderRadius: 10, marginBottom: 24,
                background: "rgba(224,85,85,0.1)", border: "1px solid rgba(224,85,85,0.3)",
                fontSize: 13, color: "#E05555", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <span>⚠ {error}</span>
              <button onClick={() => setError(null)} style={{ background: "none", border: "none", color: "#E05555", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading === "brand" && <LoadingScreen key="loading-brand" type="brand" />}
          {loading === "content" && <LoadingScreen key="loading-content" type="content" />}
          {!loading && step === 1 && (
            <Step1Input
              key="step1"
              data={formData}
              onChange={d => setFormData(prev => ({ ...prev, ...d }))}
              onNext={handleAnalyzeBrand}
            />
          )}
          {!loading && step === 2 && brandDNA && (
            <Step2BrandDNA
              key="step2"
              brandDNA={brandDNA}
              businessName={formData.businessName}
              onNext={() => setStep(3)}
            />
          )}
          {!loading && step === 3 && (
            <Step3Campaign
              key="step3"
              platforms={platforms}
              campaignTheme={campaignTheme}
              customGoal={customGoal}
              onPlatformToggle={togglePlatform}
              onThemeChange={setCampaignTheme}
              onGoalChange={setCustomGoal}
              onNext={handleGenerateCampaign}
            />
          )}
          {!loading && step === 4 && content && (
            <Step4Results
              key="step4"
              content={content}
              imageBase64={imageBase64}
              businessName={formData.businessName}
              platforms={platforms}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
