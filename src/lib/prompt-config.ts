import { STYLE_LABELS } from "./cities";
import { getCityFactsForPrompt } from "./city-knowledge";
import type { StoryStyle } from "./types";

interface StylePromptConfig {
  toneKeywords: string[];
  narrativeAngle: string;
  exampleHook?: string;
  styleHint: string;
}

interface PromptConfig {
  systemTemplate: string;
  userTemplate: string;
  styles: Record<StoryStyle, StylePromptConfig>;
}

function loadPromptConfig(): PromptConfig {
  const encoded = process.env.STORY_PROMPT_CONFIG_BASE64;
  if (!encoded) {
    throw new Error("STORY_PROMPT_CONFIG_BASE64 required");
  }

  try {
    return JSON.parse(Buffer.from(encoded, "base64").toString("utf8")) as PromptConfig;
  } catch {
    throw new Error("STORY_PROMPT_CONFIG_BASE64 is invalid");
  }
}

function renderTemplate(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? "");
}

export function buildStoryPrompts(
  city: string,
  style: StoryStyle
): { system: string; user: string } {
  const config = loadPromptConfig();
  const styleConfig = config.styles[style];
  if (!styleConfig) throw new Error(`Prompt style not configured: ${style}`);

  const cityFacts = getCityFactsForPrompt(city);
  const factsBlock = cityFacts
    ? `【${city}事实参考，必须用到至少 3 条】\n${cityFacts}`
    : `【${city}无预设资料，请基于真实地理、历史、饮食知识生成，禁止泛泛而谈】`;

  const values = {
    city,
    styleLabel: STYLE_LABELS[style] ?? "综合",
    narrativeAngle: styleConfig.narrativeAngle,
    toneKeywords: styleConfig.toneKeywords.join("、"),
    exampleHook: styleConfig.exampleHook
      ? `hook 参考风格（不要照抄）：${styleConfig.exampleHook}`
      : "",
    styleHint: styleConfig.styleHint,
    factsBlock,
  };

  return {
    system: renderTemplate(config.systemTemplate, values),
    user: renderTemplate(config.userTemplate, values),
  };
}
