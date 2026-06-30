import type { CityStory, StoryStyle } from "./types";
import { buildStoryPrompts } from "./prompt-config";
import { buildStoryFromKnowledge } from "./city-knowledge";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LLMProvider {
  generate(messages: Message[]): Promise<string>;
}

class MockProvider implements LLMProvider {
  async generate(messages: Message[]): Promise<string> {
    const userMsg = messages.find((m) => m.role === "user")?.content ?? "";
    const cityMatch = userMsg.match(/「(.+?)」/);
    const city = cityMatch?.[1] ?? "这座城市";

    const styleMatch = userMsg.match(/一段(.+?)风格/);
    const styleLabel = styleMatch?.[1] ?? "综合";
    const styleMap: Record<string, StoryStyle> = {
      综合: "all",
      神话传说: "mythology",
      未来科幻: "future",
      美食味道: "food",
      历史人文: "history",
      科技创新: "tech",
    };
    const style = styleMap[styleLabel] ?? "all";

    const story = buildStoryFromKnowledge(city, style);
    return JSON.stringify(story);
  }
}

class OpenAIProvider implements LLMProvider {
  constructor(
    private apiKey: string,
    private model: string
  ) {}

  async generate(messages: Message[]): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.85,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error: ${res.status} ${err}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }
}

class DeepSeekProvider implements LLMProvider {
  constructor(
    private apiKey: string,
    private model: string
  ) {}

  async generate(messages: Message[]): Promise<string> {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.85,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DeepSeek API error: ${res.status} ${err}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }
}

function getProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER ?? "mock";

  switch (provider) {
    case "openai":
      if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY required");
      return new OpenAIProvider(
        process.env.OPENAI_API_KEY,
        process.env.OPENAI_MODEL ?? "gpt-4o-mini"
      );
    case "deepseek":
      if (!process.env.DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY required");
      return new DeepSeekProvider(
        process.env.DEEPSEEK_API_KEY,
        process.env.DEEPSEEK_MODEL ?? "deepseek-chat"
      );
    default:
      return new MockProvider();
  }
}

function parseStoryResponse(raw: string, city: string, style: StoryStyle): CityStory {
  const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return {
    city,
    style,
    title: parsed.title,
    hook: parsed.hook,
    estimatedMinutes: parsed.estimatedMinutes ?? 5,
    segments: parsed.segments.map(
      (s: { id?: string; title: string; content: string; mood?: string }, i: number) => ({
        id: s.id ?? String(i + 1),
        title: s.title,
        content: s.content,
        mood: s.mood,
      })
    ),
  };
}

export async function generateCityStory(
  city: string,
  style: StoryStyle
): Promise<CityStory> {
  if ((process.env.LLM_PROVIDER ?? "mock") === "mock") {
    return { city, style, ...buildStoryFromKnowledge(city, style) };
  }

  const provider = getProvider();
  const prompts = buildStoryPrompts(city, style);

  const messages: Message[] = [
    { role: "system", content: prompts.system },
    { role: "user", content: prompts.user },
  ];

  const raw = await provider.generate(messages);
  return parseStoryResponse(raw, city, style);
}

export function generateARAnchors(story: CityStory): import("./types").ARAnchor[] {
  return story.segments.map((seg, i) => ({
    poiId: `${story.city}-${seg.id}`,
    lat: 30.25 + i * 0.01,
    lng: 120.15 + i * 0.01,
    segmentId: seg.id,
    spatialAudio: true,
  }));
}
