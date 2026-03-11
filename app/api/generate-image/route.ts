import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { brandDNA, businessName, industry, campaignTheme } = await req.json();

    const prompt = `A professional studio photo for "${businessName}", a ${industry} brand. Campaign theme: ${campaignTheme}. Use colors ${brandDNA.primaryColor}, ${brandDNA.secondaryColor}, ${brandDNA.accentColor}. Style: ${brandDNA.visualStyle}. Mood: ${brandDNA.brandEmotion}. Personality: ${brandDNA.personalityTags?.join(", ")}. High-end commercial photography, 1:1 square for Instagram, aspirational quality, no text or logos.`;

    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "1:1",
        outputMimeType: "image/jpeg",
      },
    });

    const imageBytes = response.generatedImages?.[0]?.image?.imageBytes ?? null;

    if (!imageBytes) {
      const filtered = response.generatedImages?.[0];
      console.error(
        "generate-image: no imageBytes in Imagen response.",
        "filteredReason:", (filtered as any)?.filteredReason ?? "unknown",
        JSON.stringify(response).slice(0, 400)
      );
      return NextResponse.json(
        { success: false, error: "No image data returned — content may have been filtered" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, imageBase64: imageBytes });
  } catch (error: unknown) {
    console.error("generate-image error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}