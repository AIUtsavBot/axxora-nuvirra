import { NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/integrations/gemini";
import { seedData } from "@/lib/data/seed";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic");
    const campaign = searchParams.get("campaign");
    const platform = searchParams.get("platform") ?? "Instagram";

    if (!topic || !campaign) {
      return NextResponse.json({ error: "Missing topic or campaign" }, { status: 400 });
    }

    const brandTone = seedData.context.find((ctx) => ctx.id === "ctx-1")?.detail ?? "";
    const catalog = seedData.context.find((ctx) => ctx.id === "ctx-2")?.detail ?? "";

    const systemInstruction = `You are Nuvirra's AI Content Generator.
Nuvirra is a premium utensils and cookware brand.
Brand tone guidelines: ${brandTone}
Product catalog context: ${catalog}

Goal: Generate high-quality marketing hooks and captions for social media.
Output format:
List 3 distinct post variations. For each variation, write a short engaging Hook (first line) and a Caption (body).
Format it with clear labels (e.g. "Post 1:", "Post 2:", etc.).`;

    const prompt = `Platform: ${platform}
Campaign: ${campaign}
Topic to cover: ${topic}

Generate 3 alternative post captions & hooks appropriate for the chosen platform. Keep them aligned with Nuvirra's premium home-cooking brand.`;

    const content = await generateWithGemini(prompt, systemInstruction);

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("[AI Content Generator API Exception]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
