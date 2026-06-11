import { NextRequest, NextResponse } from "next/server";
import { generateCityStory, generateARAnchors } from "@/lib/story-engine";
import type { GenerateStoryRequest, StoryStyle } from "@/lib/types";

const VALID_STYLES: StoryStyle[] = [
  "mythology", "future", "food", "history", "tech", "all",
];

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      { status: 429 }
    );
  }

  try {
    const body: GenerateStoryRequest = await req.json();
    const { city, style, format = "standard" } = body;

    if (!city?.trim()) {
      return NextResponse.json({ error: "请提供城市名称" }, { status: 400 });
    }

    if (!VALID_STYLES.includes(style)) {
      return NextResponse.json({ error: "无效的风格" }, { status: 400 });
    }

    const story = await generateCityStory(city.trim(), style);

    const response: Record<string, unknown> = { story };

    if (format === "ar") {
      response.anchors = generateARAnchors(story);
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error("generate-story error:", err);
    return NextResponse.json(
      { error: "生成故事失败，请稍后重试" },
      { status: 500 }
    );
  }
}
