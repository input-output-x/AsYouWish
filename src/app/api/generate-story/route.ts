import { NextRequest, NextResponse } from "next/server";
import { generateCityStory, generateARAnchors } from "@/lib/story-engine";
import type { GenerateStoryRequest, StoryStyle } from "@/lib/types";
import { getStoryQuality } from "@/lib/content-quality";
import { allowRequest, getClientIp } from "@/lib/rate-limit";

const VALID_STYLES: StoryStyle[] = [
  "mythology", "future", "food", "history", "tech", "all",
];

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (
    !allowRequest("story-minute", ip, 8, 60_000) ||
    !allowRequest("story-hour", ip, 60, 3_600_000)
  ) {
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      { status: 429 }
    );
  }

  try {
    const body: GenerateStoryRequest = await req.json();
    const { city, style, format = "standard" } = body;

    if (!city?.trim() || city.trim().length > 40) {
      return NextResponse.json({ error: "请提供城市名称" }, { status: 400 });
    }

    if (!VALID_STYLES.includes(style)) {
      return NextResponse.json({ error: "无效的风格" }, { status: 400 });
    }

    const story = await generateCityStory(city.trim(), style);
    story.quality = getStoryQuality(city.trim());

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
