# 想你所想 · 技术架构

---

## 1. 架构总览

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
│  Web MVP │ visionOS │ CarPlay │ 任意载体（阶段 3 API 客户端）  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                      API Gateway                             │
│              /api/generate-story  /api/tts                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Story Engine（核心）                       │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Prompt      │  │ LLM Provider │  │ Output Parser     │  │
│  │ Registry    │→ │ (可插拔)      │→ │ (结构化 JSON)      │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    扩展层（阶段 2+）                           │
│  TTS Engine │ Geo Trigger │ AR Anchor │ POI Database         │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 目录结构

```
AsYouWish/
├── docs/                    # PRD、架构、IP 文档
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/
│   │   │   └── generate-story/
│   │   └── page.tsx
│   ├── components/          # UI 组件
│   └── lib/
│       ├── types.ts         # 共享类型
│       ├── cities.ts        # 城市数据
│       ├── geolocation.ts   # 定位与城市匹配
│       ├── tts.ts           # 语音合成抽象
│       ├── story-engine.ts  # 生成编排
│       └── prompts/         # 提示词模板（核心 IP）
│           ├── index.ts
│           ├── base.ts
│           └── styles/      # 各风格模板
├── .env.example
└── package.json
```

---

## 3. 核心类型

```typescript
// 叙事风格
type StoryStyle = 'mythology' | 'future' | 'food' | 'history' | 'tech' | 'all';

// 结构化故事输出
interface CityStory {
  city: string;
  style: StoryStyle;
  title: string;
  hook: string;           // 开场 15 秒抓住人
  segments: StorySegment[];
  estimatedMinutes: number;
}

interface StorySegment {
  id: string;
  title: string;
  content: string;        // 朗读文本
  mood?: string;          // VibeCoding 氛围标签
}

// 阶段 2 AR 扩展
interface ARAnchor {
  poiId: string;
  lat: number;
  lng: number;
  segmentId: string;      // 关联故事段落
  spatialAudio?: boolean;
}
```

---

## 4. Prompt Registry（提示词引擎）

### 4.1 设计原则

- **模板与变量分离**：城市名、风格参数注入，模板本身是可迭代资产
- **结构化输出**：强制 JSON schema，便于 TTS 分段与 AR 锚点
- **风格可扩展**：新增风格 = 新增 `styles/xxx.ts`

### 4.2 基础 System Prompt

```
你是「想你所想」的城市叙事师。你的任务是为到达{ city }的旅行者，
生成一段让人想听完、想分享给同车/同行伙伴的{ styleLabel }故事。

要求：
1. 开场 hook 必须在 15 秒内抓住注意力
2. 包含至少 1 个本地人才知道的小细节
3. 语言口语化，适合朗读，避免书面语
4. 分 3–5 段，每段 150–250 字
5. 输出严格 JSON 格式
```

### 4.3 风格模板示例

| 风格 | 关键词 | 叙事角度 |
|------|--------|----------|
| mythology | 神话、传说、精怪 | 地标背后的神话重写 |
| future | 2040、赛博、科幻 | 同一地点的未来想象 |
| food | 味道、老字号、市井 | 用味觉串联城市记忆 |
| history | 朝代、人物、典故 | 时间轴上的城市变迁 |
| tech | 互联网、创业、硬科技 | 城市作为科技叙事背景 |
| all | 综合 | 吃喝玩乐+故事+科技混搭 |

文件位置：`src/lib/prompts/styles/*.ts`

---

## 5. Story Engine 流程

```
输入: { city, style, locale? }
    ↓
1. resolvePrompt(city, style)     → 组装 system + user prompt
    ↓
2. llm.generate(prompt)           → 原始文本
    ↓
3. parseStoryResponse(raw)        → CityStory JSON
    ↓
4. validate + fallback            → 解析失败则重试或 mock
    ↓
输出: CityStory
```

### LLM Provider 抽象

```typescript
interface LLMProvider {
  generate(messages: Message[]): Promise<string>;
}

// 实现：OpenAIProvider | DeepSeekProvider | MockProvider
```

环境变量 `LLM_PROVIDER=openai|deepseek|mock`

---

## 6. TTS 层

| 层级 | 实现 | 场景 |
|------|------|------|
| L0 | Web Speech API | MVP 零成本 |
| L1 | OpenAI TTS / 通义 TTS | 音质提升 |
| L2 | 空间音频 (visionOS) | 阶段 2 |

```typescript
interface TTSEngine {
  speak(text: string, options?: TTSOptions): Promise<void>;
  stop(): void;
}
```

---

## 7. 地理触发（Geo Trigger）

### MVP 实现

- 浏览器 `navigator.geolocation` 每 60s 或 significant change
- 逆地理编码：OpenStreetMap Nominatim（免费）或高德（阶段 1.5）
- 城市边界匹配 → 与上次城市对比 → 变化则触发 `ArrivalPrompt`

### 阶段 1.5

- 高德 Android/iOS SDK 后台定位
- CarPlay 场景：仅语音，无 UI

```typescript
interface GeoTrigger {
  onCityChange(callback: (city: string) => void): void;
  getCurrentCity(): Promise<string | null>;
}
```

---

## 8. 阶段 2 AR 扩展接口

预留 REST API，visionOS 客户端可直接调用：

```
POST /api/generate-story
Body: { city, style, format: "ar" }

Response: CityStory + anchors: ARAnchor[]
```

`ARAnchor` 将 story segment 绑定到 POI 坐标，visionOS 客户端负责渲染。

---

## 9. 环境变量

```bash
# LLM
LLM_PROVIDER=mock          # mock | openai | deepseek
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DEEPSEEK_API_KEY=

# TTS（可选）
TTS_PROVIDER=browser       # browser | openai

# Geo（可选，阶段 1.5）
AMAP_API_KEY=
```

---

## 10. 部署建议

| 阶段 | 方案 |
|------|------|
| MVP | Vercel / 本地开发 |
| 生产 | Vercel + Edge Functions，或国内云（需 ICP） |
| AR | visionOS App 独立仓库，调用同一 API |

---

## 11. 安全与限流

- API Key 仅存服务端，不暴露给客户端
- `/api/generate-story` 限流：10 req/min/IP
- 生成内容日志脱敏，不存用户精确 GPS

---

*文档版本：v0.1 · 2026-06-09*
