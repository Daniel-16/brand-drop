import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType, businessName, industry, description } = await req.json();

    const prompt = `You are a world-class brand strategist. Analyze this business image and the provided context to extract a complete Brand DNA.

Business Name: ${businessName}
Industry: ${industry}
Description: ${description}

Based on the image and context, extract a comprehensive Brand DNA. Return ONLY a valid JSON object with this exact structure:
{
  "primaryColor": "#hexcode",
  "secondaryColor": "#hexcode", 
  "accentColor": "#hexcode",
  "typographyStyle": "Modern Sans / Classic Serif / Playful Display / Elegant Script / Bold Industrial",
  "typographyMood": "brief mood description",
  "brandVoice": "Warm & Friendly / Bold & Confident / Luxurious & Refined / Playful & Fun / Professional & Trustworthy",
  "targetAudience": "specific audience description",
  "personalityTags": ["tag1", "tag2", "tag3", "tag4"],
  "visualStyle": "Minimalist / Vibrant & Energetic / Earthy & Natural / Dark & Luxe / Clean & Corporate",
  "brandEmotion": "The core feeling this brand evokes",
  "colorRationale": "Why these colors work for this brand"
}

Be specific and thoughtful. Colors should complement each other and suit the industry. Personality tags should be evocative.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: imageBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text ?? "";
    const brandDNA = JSON.parse(text);

    return NextResponse.json({ success: true, brandDNA });
  } catch (error: unknown) {
    console.error("analyze-brand error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
