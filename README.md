# 想你所想 · AsYouWish

> 到一个城市，看见它的灵魂

位置 + 意图 → 即时沉浸式城市体验。软件已死，情境即界面。

## 三阶段愿景

| 阶段 | 载体 | 体验 |
|------|------|------|
| **1 · 听** | Web / 车机 | 到达城市 → 语音叙事（当前 MVP） |
| **2 · 看** | Vision Pro / AR | 抬头即见城市信息层 |
| **3 · 想** | 任意物体 | 提示城市名 → 进入该城体验 |

## 快速开始

```bash
# 安装依赖
npm install

# 复制环境变量（默认 mock 模式，无需 API Key）
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

## 使用真实 AI 生成

编辑 `.env.local`：

```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

或使用 DeepSeek：

```bash
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=...
```

## 功能

- 选择城市 + 叙事风格（神话 / 未来 / 美食 / 历史 / 科技 / 综合）
- LLM 生成结构化城市故事
- 浏览器 TTS 语音播放
- GPS 定位：到达新城市时弹出「是否播放？」
- AR 扩展接口：`format: "ar"` 返回空间锚点

## 文档

- [产品需求文档](docs/PRD.md)
- [技术架构](docs/ARCHITECTURE.md)
- [想法保护与知识产权](docs/IP-PROTECTION.md)

## 项目结构

```
AsYouWish/
├── docs/           # PRD、架构、IP 保护
├── src/
│   ├── app/        # Next.js 页面与 API
│   ├── components/ # UI 组件
│   └── lib/
│       ├── prompts/    # 提示词模板（核心资产，勿公开）
│       ├── story-engine.ts
│       ├── tts.ts
│       └── geolocation.ts
└── .env.example
```

## 技术栈

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 4
- Web Speech API（TTS）
- OpenStreetMap Nominatim（逆地理编码）

---

**想你所想** — 先到先想，先想先做。
