export interface TTSOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  voiceId?: VoiceId;
}

import type { VoiceId } from "@/lib/types";

export const VOICE_PROFILES = {
  "female-warm": {
    id: "female-warm",
    name: "晓晓",
    label: "温暖女声",
    edgeVoice: "zh-CN-XiaoxiaoNeural",
    browserRate: 0.92,
    browserPitch: 1.05,
    browserKeywords: ["Xiaoxiao", "Tingting", "Meijia", "Yaoyao", "Huihui", "Female", "女"],
  },
  "male-magnetic": {
    id: "male-magnetic",
    name: "云扬",
    label: "磁性男声",
    edgeVoice: "zh-CN-YunyangNeural",
    browserRate: 0.9,
    browserPitch: 0.82,
    browserKeywords: ["Yunyang", "Yunxi", "Kangkang", "Male", "男"],
  },
} as const satisfies Record<VoiceId, {
  id: VoiceId;
  name: string;
  label: string;
  edgeVoice: string;
  browserRate: number;
  browserPitch: number;
  browserKeywords: readonly string[];
}>;

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let playbackGeneration = 0;

function getTTSProvider(): "edge" | "browser" {
  if (typeof window === "undefined") return "edge";
  return (process.env.NEXT_PUBLIC_TTS_PROVIDER as "edge" | "browser") ?? "edge";
}

export function isTTSSupported(): boolean {
  if (typeof window === "undefined") return false;
  return getTTSProvider() === "edge" || "speechSynthesis" in window;
}

function pickBrowserVoice(voices: SpeechSynthesisVoice[], voiceId: VoiceId) {
  const zhVoices = voices.filter((v) => v.lang.startsWith("zh"));
  const profile = VOICE_PROFILES[voiceId];

  for (const keyword of profile.browserKeywords) {
    const match = zhVoices.find((v) => v.name.includes(keyword));
    if (match) return match;
  }

  return zhVoices[0];
}

async function speakBrowser(text: string, options: TTSOptions = {}): Promise<void> {
  if (!("speechSynthesis" in window)) {
    throw new Error("浏览器不支持语音合成");
  }

  window.speechSynthesis.cancel();

  const voices = await loadVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  const profile = VOICE_PROFILES[options.voiceId ?? "female-warm"];
  utterance.lang = options.lang ?? "zh-CN";
  utterance.rate = options.rate ?? profile.browserRate;
  utterance.pitch = options.pitch ?? profile.browserPitch;

  const voice = pickBrowserVoice(voices, profile.id);
  if (voice) utterance.voice = voice;

  return new Promise((resolve, reject) => {
    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };
    utterance.onerror = (e) => {
      currentUtterance = null;
      reject(e);
    };
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}

async function speakEdge(text: string, voiceId: VoiceId): Promise<void> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voiceId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "语音合成失败" }));
    throw new Error(err.error ?? "语音合成失败");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    currentAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      reject(new Error("音频播放失败"));
    };

    audio.play().catch(reject);
  });
}

export async function speak(text: string, options: TTSOptions = {}): Promise<void> {
  stopSpeaking();
  const generation = playbackGeneration;

  const provider = getTTSProvider();

  if (provider === "edge") {
    try {
      await speakEdge(text, options.voiceId ?? "female-warm");
      return;
    } catch {
      if (generation !== playbackGeneration) return;
      // Edge TTS 失败时降级到浏览器语音
    }
  }

  if (generation !== playbackGeneration) return;
  await speakBrowser(text, options);
}

export function stopSpeaking(): void {
  playbackGeneration += 1;
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio.load();
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function pauseSpeaking(): boolean {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    return true;
  }
  if (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    window.speechSynthesis.speaking
  ) {
    window.speechSynthesis.pause();
    return true;
  }
  return false;
}

export function resumeSpeaking(): boolean {
  if (currentAudio?.paused) {
    void currentAudio.play();
    return true;
  }
  if (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    window.speechSynthesis.paused
  ) {
    window.speechSynthesis.resume();
    return true;
  }
  return false;
}

export function isSpeaking(): boolean {
  if (currentAudio && !currentAudio.paused) return true;
  return typeof window !== "undefined" && window.speechSynthesis.speaking;
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
}
