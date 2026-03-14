import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { brandDNA, businessName, industry, campaignTheme } =
      await req.json();

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not set");
    }

    const prompt = [
      `Professional brand image for ${businessName}, a ${industry} business.`,
      `Campaign theme: ${campaignTheme}.`,
      `Visual style: ${brandDNA.visualStyle}.`,
      `Mood: ${brandDNA.brandEmotion}.`,
      `Primary color: ${brandDNA.primaryColor}, secondary color: ${brandDNA.secondaryColor}.`,
      "Square composition, no text, no logos, product photography.",
    ].join(" ");

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No content returned from Gemini");
    }

    const imagePart = parts.find((p: { inlineData?: { data?: string; mimeType?: string } }) => p.inlineData?.data);
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image data in Gemini response");
    }

    return NextResponse.json({
      success: true,
      imageBase64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType ?? "image/png",
      provider: "gemini",
    });
  } catch (error: unknown) {
    console.error("=== GENERATE IMAGE ERROR ===");
    console.error("Type:", typeof error);
    console.error("Full error:", JSON.stringify(error, null, 2));
    console.error("Message:", (error as Error)?.message);
    console.error("Stack:", (error as Error)?.stack);
    console.error("============================");
    const message = (error as Error)?.message ?? String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}