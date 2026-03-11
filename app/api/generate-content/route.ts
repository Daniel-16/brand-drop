import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { brandDNA, businessName, industry, description, platforms, campaignTheme, customGoal } = await req.json();

    const platformInstructions = platforms.map((p: string) => {
      if (p === "instagram") return `
Instagram:
- bio: Punchy 150-char bio with relevant emojis
- caption: Engaging caption (max 150 words), story-driven, ends with a CTA
- hashtags: Array of 15 highly targeted hashtags (mix of niche, mid, broad)`;
      if (p === "facebook") return `
Facebook:
- bio: Professional page about section (max 255 chars)
- caption: Conversational caption (max 200 words), community-focused, includes a question to drive engagement
- hashtags: Array of 5-8 relevant hashtags`;
      if (p === "whatsapp") return `
WhatsApp:
- statusCaption: Ultra-short punchy status (max 40 words, no hashtags)
- broadcastMessage: Personal broadcast message (max 120 words), conversational tone like talking to a customer, includes price/offer hint if relevant, ends with contact instruction`;
      return "";
    }).join("\n");

    const prompt = `You are an elite social media copywriter specializing in Nigerian SMB brands.

Brand DNA:
- Business: ${businessName} (${industry})
- Description: ${description}
- Brand Voice: ${brandDNA.brandVoice}
- Target Audience: ${brandDNA.targetAudience}
- Personality: ${brandDNA.personalityTags?.join(", ")}
- Campaign Theme: ${campaignTheme}
- Custom Goal: ${customGoal || "Increase brand awareness and drive sales"}

Generate compelling social media content for each platform. Make it feel authentic, culturally relevant for Nigeria/West Africa where applicable, and aligned with the brand voice.

${platformInstructions}

Return ONLY a valid JSON object:
{
  "instagram": ${platforms.includes("instagram") ? '{"bio": "...", "caption": "...", "hashtags": [...]}' : "null"},
  "facebook": ${platforms.includes("facebook") ? '{"bio": "...", "caption": "...", "hashtags": [...]}' : "null"},
  "whatsapp": ${platforms.includes("whatsapp") ? '{"statusCaption": "...", "broadcastMessage": "..."}' : "null"}
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const text = response.text ?? "";
    const content = JSON.parse(text);

    return NextResponse.json({ success: true, content });
  } catch (error: unknown) {
    console.error("generate-content error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
