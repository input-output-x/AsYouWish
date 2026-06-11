export { POPULAR_CITIES } from "./regions";
export { REGIONS, ALL_CITIES, normalizeCityName, findRegionByCity } from "./regions";
export const STYLE_OPTIONS = [
  {
    id: "all" as const,
    label: "综合",
    emoji: "✨",
    description: "吃喝玩乐 + 故事 + 科技，一次听个够",
  },
  {
    id: "mythology" as const,
    label: "神话",
    emoji: "🐉",
    description: "地标背后的传说与精怪",
  },
  {
    id: "future" as const,
    label: "未来",
    emoji: "🚀",
    description: "2040 年的这座城市",
  },
  {
    id: "food" as const,
    label: "美食",
    emoji: "🍜",
    description: "用味道串联城市记忆",
  },
  {
    id: "history" as const,
    label: "历史",
    emoji: "📜",
    description: "朝代更迭中的人物与典故",
  },
  {
    id: "tech" as const,
    label: "科技",
    emoji: "💡",
    description: "互联网与硬科技的城市叙事",
  },
];

export const STYLE_LABELS: Record<string, string> = {
  all: "综合",
  mythology: "神话传说",
  future: "未来科幻",
  food: "美食味道",
  history: "历史人文",
  tech: "科技创新",
};
