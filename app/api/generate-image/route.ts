import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { brandDNA, businessName, industry, campaignTheme } = await req.json();

    const prompt = `Create a stunning, studio-quality campaign image for "${businessName}", a ${industry} brand.

Brand DNA:
- Primary Color: ${brandDNA.primaryColor}
- Secondary Color: ${brandDNA.secondaryColor}
- Accent Color: ${brandDNA.accentColor}
- Visual Style: ${brandDNA.visualStyle}
- Brand Emotion: ${brandDNA.brandEmotion}
- Campaign Theme: ${campaignTheme}
- Personality: ${brandDNA.personalityTags?.join(", ")}

Requirements:
- Use the brand colors as the dominant palette
- Match the ${brandDNA.visualStyle} visual style
- Evoke ${brandDNA.brandEmotion}
- Professional, social-media-ready composition
- NO text, NO watermarks, NO logos
- Perfect 1:1 square composition for Instagram
- High-end commercial photography aesthetic
- Clean, modern, aspirational quality

The image should feel like it belongs on the feed of a successful brand. Make it visually striking and on-brand.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    let imageData: string | null = null;

    for (const candidate of response.candidates ?? []) {
      for (const part of candidate.content?.parts ?? []) {
        if (part.inlineData?.data) {
          imageData = part.inlineData.data;
          break;
        }
      }
      if (imageData) break;
    }

    if (!imageData) {
      const res = response as { parts?: Array<{ inlineData?: { data?: string } }> };
      for (const part of res.parts ?? []) {
        if (part.inlineData?.data) {
          imageData = part.inlineData.data;
          break;
        }
      }
    }

    if (!imageData) {
      console.error("generate-image: no inlineData found in response", JSON.stringify(response).slice(0, 400));
      return NextResponse.json({ success: false, error: "No image data in response" }, { status: 500 });
    }

    return NextResponse.json({ success: true, imageBase64: imageData });
  } catch (error: unknown) {
    console.error("generate-image error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}