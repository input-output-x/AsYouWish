export interface TTSOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
}

/** 温柔年轻女声配置 */
export const VOICE_PROFILE = {
  name: "晓晓",
  description: "温柔女声 · 约 25 岁",
  edgeVoice: "zh-CN-XiaoxiaoNeural",
  browserRate: 0.92,
  browserPitch: 1.05,
} as const;

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

function getTTSProvider(): "edge" | "browser" {
  if (typeof window === "undefined") return "edge";
  return (process.env.NEXT_PUBLIC_TTS_PROVIDER as "edge" | "browser") ?? "edge";
}

export function isTTSSupported(): boolean {
  if (typeof window === "undefined") return false;
  return getTTSProvider() === "edge" || "speechSynthesis" in window;
}

function pickGentleFemaleVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | undefined {
  const zhVoices = voices.filter((v) => v.lang.startsWith("zh"));

  const preferred = [
    "Xiaoxiao",
    "Tingting",
    "Meijia",
    "Yaoyao",
    "Huihui",
    "Sinji",
    "Female",
    "女",
  ];

  for (const keyword of preferred) {
    const match = zhVoices.find((v) => v.name.includes(keyword));
    if (match) return match;
  }

  const female = zhVoices.find(
    (v) => !v.name.match(/male|男|Kangkang|Yu-shu|Li-mu/i)
  );
  return female ?? zhVoices[0];
}

async function speakBrowser(text: string, options: TTSOptions = {}): Promise<void> {
  if (!("speechSynthesis" in window)) {
    throw new Error("浏览器不支持语音合成");
  }

  window.speechSynthesis.cancel();

  const voices = await loadVoices();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.lang ?? "zh-CN";
  utterance.rate = options.rate ?? VOICE_PROFILE.browserRate;
  utterance.pitch = options.pitch ?? VOICE_PROFILE.browserPitch;

  const voice = pickGentleFemaleVoice(voices);
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

async function speakEdge(text: string): Promise<void> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
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

  const provider = getTTSProvider();

  if (provider === "edge") {
    try {
      await speakEdge(text);
      return;
    } catch {
      // Edge TTS 失败时降级到浏览器语音
    }
  }

  await speakBrowser(text, options);
}

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
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
