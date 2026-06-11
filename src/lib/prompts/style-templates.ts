import type { StoryStyle } from "../types";

export interface StyleTemplate {
  id: StoryStyle;
  toneKeywords: string[];
  narrativeAngle: string;
  exampleHook?: string;
}

export const styleTemplates: Record<StoryStyle, StyleTemplate> = {
  all: {
    id: "all",
    toneKeywords: ["温暖", "好奇", "惊喜"],
    narrativeAngle: "像本地朋友开车带你逛城",
    exampleHook: "你知道为什么老杭州人从不问「西湖好不好看」吗？",
  },
  mythology: {
    id: "mythology",
    toneKeywords: ["神秘", "空灵", "史诗"],
    narrativeAngle: "地标背后的传说与精怪",
    exampleHook: "雷峰塔下压着的，可能不只是白娘子……",
  },
  future: {
    id: "future",
    toneKeywords: ["赛博", "想象", "震撼"],
    narrativeAngle: "2040 年同一地点的科幻版本",
    exampleHook: "如果此刻抬头，你看到的不是天空，是成都的上层云城……",
  },
  food: {
    id: "food",
    toneKeywords: ["烟火", "馋人", "怀旧"],
    narrativeAngle: "用味道串联城市记忆",
    exampleHook: "成都人凌晨三点还在排队的那碗面，其实藏着一个秘密……",
  },
  history: {
    id: "history",
    toneKeywords: ["厚重", "人物", "时间"],
    narrativeAngle: "朝代更迭中的城市记忆",
    exampleHook: "一千三百年前，有个决定改变了这座城市的命运……",
  },
  tech: {
    id: "tech",
    toneKeywords: ["创新", "年轻", "野心"],
    narrativeAngle: "互联网与硬科技的城市叙事",
    exampleHook: "深圳南山的那栋普通写字楼，曾经诞生过改变十亿人生活的代码……",
  },
};
