# 想你所想 · AsYouWish

[![Status](https://img.shields.io/badge/status-v0.1%20Release-green)](https://github.com/input-output-x/AsYouWish)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](package.json)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-private-lightgrey)](#license--许可证)

> 到一个城市，看见它的灵魂  
> *Arrive in a city. Discover its soul.*

---

## 项目状态 · Project Status

| | |
|---|---|
| **状态 Status** | ✅ **第一版 · v0.1 Release** |
| **当前阶段 Phase** | MVP 公测准备 · public beta ready |
| **公网地址 Live URL** | [as-you-wish-t7ff.onrender.com](https://as-you-wish-t7ff.onrender.com) |
| **版本 Version** | `0.1.0` |

> 本项目为第一版公测产品，AI 内容可能存在误差，请以权威资料为准。
> *This is an early public beta. AI-generated content may contain inaccuracies.*

---

## 简介 · About

**想你所想（AsYouWish）** 是一款位置驱动的城市叙事产品：到达一座城市，用语音（未来扩展至 AR）呈现当地的故事、美食、历史与想象。

*A location-driven city storytelling product: arrive in a city, hear its stories, food, history, and imagination — voice today, AR tomorrow.*

**核心理念 · Core idea**

> 软件已死，情境即界面。  
> *Apps are dead. Context is the interface.*

---

## 目录 · Table of Contents

- [项目状态 · Project Status](#项目状态--project-status)
- [简介 · About](#简介--about)
- [三阶段愿景 · Three-Phase Vision](#三阶段愿景--three-phase-vision)
- [功能 · Features](#功能--features)
- [快速开始 · Quick Start](#快速开始--quick-start)
- [环境变量 · Environment Variables](#环境变量--environment-variables)
- [项目结构 · Project Structure](#项目结构--project-structure)
- [文档 · Documentation](#文档--documentation)
- [技术栈 · Tech Stack](#技术栈--tech-stack)
- [路线图 · Roadmap](#路线图--roadmap)
- [License · 许可证](#license--许可证)

---

## 三阶段愿景 · Three-Phase Vision

| 阶段 Phase | 载体 Medium | 体验 Experience | 状态 Status |
|------------|-------------|-----------------|-------------|
| **1 · 听 Listen** | Web / 车机 | 到达城市 → 语音叙事 | ✅ 当前 MVP |
| **2 · 看 See** | Vision Pro / AR | 抬头即见城市信息层 | 🔜 规划中 |
| **3 · 想 Imagine** | 任意物体 | 提示城市名 → 进入该城体验 | 🔜 规划中 |

---

## 功能 · Features

| 功能 Feature | 说明 Description |
|--------------|------------------|
| 🗺️ 全国城市 | 337 个地级城市，按省 / 直辖市 / 自治区划分 |
| 🎭 叙事风格 | 神话、未来、美食、历史、科技、综合 |
| 🤖 AI 生成 | DeepSeek / OpenAI 结构化城市故事 |
| 🔊 语音朗读 | Edge 神经语音「晓晓」女声 /「云扬」男声，可试听切换 |
| ⏯️ 播放控制 | 暂停续播、上一段、下一段、失败重试 |
| 📍 到达触发 | GPS 检测新城市，询问是否播放 |
| ⭐ 收藏复听 | 本机保存收藏与最近播放 |
| 📤 一键分享 | Web Share / 剪贴板 fallback |
| 🧭 定位代理 | 服务端反查城市，减少浏览器端不稳定 |
| 🥽 AR 预留 | API 支持 `format: "ar"` 返回空间锚点 |

---

## 快速开始 · Quick Start

### 环境要求 · Prerequisites

- Node.js 18+
- npm

### 本地运行 · Run Locally

```bash
# 1. 克隆仓库 · Clone
git clone https://github.com/input-output-x/AsYouWish.git
cd AsYouWish

# 2. 安装依赖 · Install
npm install

# 3. 配置环境变量 · Configure env
cp .env.example .env.local

# 4. 启动（默认 mock 模式，无需 API Key）· Start dev server
npm run dev
```

浏览器打开 · Open [http://localhost:3000](http://localhost:3000)

### 启用真实 AI · Enable Real AI

编辑 `.env.local`：

```bash
# DeepSeek（推荐 · recommended）
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-your-key-here
STORY_PROMPT_CONFIG_BASE64=your-private-base64-config

# 或 OpenAI · or OpenAI
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

> 🔒 切勿将 API Key 提交到 Git。`.env.local` 已在 `.gitignore` 中。  
> *Never commit API keys. `.env.local` is gitignored.*

---

## 环境变量 · Environment Variables

| 变量 Variable | 说明 Description | 默认 Default |
|---------------|------------------|--------------|
| `LLM_PROVIDER` | `mock` / `openai` / `deepseek` | `mock` |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | — |
| `OPENAI_API_KEY` | OpenAI API 密钥 | — |
| `STORY_PROMPT_CONFIG_BASE64` | 私有故事 Prompt 配置（真实 LLM 必需） | — |
| `TTS_FEMALE_VOICE` | Edge 女声名称 | `zh-CN-XiaoxiaoNeural` |
| `TTS_MALE_VOICE` | Edge 男声名称 | `zh-CN-YunyangNeural` |
| `NEXT_PUBLIC_TTS_PROVIDER` | `edge` / `browser` | `edge` |

完整列表 · Full list: [`.env.example`](.env.example)

---

## 项目结构 · Project Structure

```
AsYouWish/
├── docs/                  # 产品与技术文档 · PRD, architecture, IP
├── src/
│   ├── app/               # Next.js 页面与 API · pages & routes
│   ├── components/        # UI 组件 · UI components
│   └── lib/
│       ├── prompt-config.ts # 从加密环境变量加载私有 Prompt
│       ├── regions.ts     # 全国城市数据 · city data
│       ├── story-engine.ts
│       ├── tts.ts
│       └── geolocation.ts
├── .env.example
└── README.md
```

---

## 文档 · Documentation

| 文档 Document | 说明 Description |
|---------------|------------------|
| [PRD.md](docs/PRD.md) | 产品需求文档 · Product requirements |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | 技术架构 · Technical architecture |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | 部署检查清单 · Deployment checklist |
| [IP-PROTECTION.md](docs/IP-PROTECTION.md) | 知识产权说明 · IP protection notes |

---

## 技术栈 · Tech Stack

| 层级 Layer | 技术 Stack |
|------------|------------|
| 框架 Framework | Next.js 15 · React 19 · TypeScript |
| 样式 Styling | Tailwind CSS 4 |
| 叙事 LLM | DeepSeek · OpenAI · mock |
| 语音 TTS | Microsoft Edge TTS + browser fallback |
| 定位 Geo | OpenStreetMap Nominatim |

---

## 路线图 · Roadmap

- [x] MVP Web 第一版
- [x] 全国城市按省划分
- [x] DeepSeek 叙事 + 晓晓语音
- [x] 收藏 / 最近播放 / 分享
- [x] 服务端定位反查代理
- [x] 双声音试听与分段播放控制
- [x] 公网部署 · Public deployment
- [ ] 10 城深度内容模板
- [ ] 车机 / CarPlay 原型
- [ ] visionOS AR 客户端

---

## License · 许可证

本项目暂未开放许可证，保留所有权利。
*No open-source license. All rights reserved.*

---

<p align="center">
  <strong>想你所想 · AsYouWish</strong><br>
  先到先想，先想先做<br>
  <em>Think first. Arrive first. Build what you imagine.</em>
</p>
