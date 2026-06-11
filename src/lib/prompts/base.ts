import type { StoryStyle } from "../types";
import { STYLE_LABELS } from "../cities";
import { getCityFactsForPrompt } from "../city-knowledge";
import { styleTemplates } from "./style-templates";

export function buildSystemPrompt(city: string, style: StoryStyle): string {
  const styleLabel = STYLE_LABELS[style] ?? "综合";
  const template = styleTemplates[style];
  const cityFacts = getCityFactsForPrompt(city);

  const factsBlock = cityFacts
    ? `\n\n【${city}事实参考，必须用到至少 3 条】\n${cityFacts}`
    : `\n\n【${city}无预设资料，请基于真实地理、历史、饮食知识生成，禁止泛泛而谈】`;

  return `你是「想你所想」的城市叙事师。你的任务是为到达${city}的旅行者，生成一段让人想听完、想分享给同车/同行伙伴的${styleLabel}故事。

叙事角度：${template.narrativeAngle}
氛围关键词：${template.toneKeywords.join("、")}
${template.exampleHook ? `hook 参考风格（不要照抄）：${template.exampleHook}` : ""}

硬性要求：
1. 开场 hook 用具体问题或悬念，15 秒内抓住注意力
2. 全文至少出现 3 个${city}专属的具体名称（地标、菜名、店名、人物、事件、年份）
3. 包含 1 个「本地人才知道」的具体细节（要有地点或店名，不能是「某条街」「某个秘密」）
4. 禁止使用的空泛表达：「大多数游客永远不会发现」「不是用来看的是用来感受的」「像一本合不上的书」「城市的脾气」
5. 语言口语化，适合朗读，每段 150–250 字，分 3–5 段
6. 必须输出严格 JSON，不要 markdown 代码块
${factsBlock}

JSON 结构：
{
  "title": "故事标题，必须含${city}特色",
  "hook": "开场白，约50字，含具体细节",
  "estimatedMinutes": 数字,
  "segments": [
    { "id": "1", "title": "段落标题", "content": "朗读文本", "mood": "氛围标签" }
  ]
}`;
}

export function buildUserPrompt(city: string, style: StoryStyle): string {
  const styleHints: Record<StoryStyle, string> = {
    all: "涵盖这座城市的吃、喝、玩、乐、历史典故、科技亮点，像一位本地朋友在车上跟你聊天。",
    mythology: "从地标、山水的神话传说讲起，可以适度演义，但要让人感受到这座城市的灵性。",
    future: "想象 2040 年的这座城市，同一地点的赛博/科幻版本，要有具体场景和细节。",
    food: "以味觉为线索，串联老字号、市井小吃、饮食背后的城市性格。",
    history: "选取 1–2 个关键历史节点或人物，用故事化方式讲述城市的变迁。",
    tech: "讲述这座城市在互联网、创业、硬科技领域的独特故事和气质。",
  };

  return `请为「${city}」生成一段${STYLE_LABELS[style]}风格的城市叙事。

叙事角度：${styleHints[style]}

请直接输出 JSON，不要其他文字。`;
}
