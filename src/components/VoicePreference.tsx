"use client";

import { useState } from "react";
import type { UserGender, VoiceId } from "@/lib/types";
import { speak, stopSpeaking, VOICE_PROFILES } from "@/lib/tts";
import { track } from "@/lib/analytics";

interface VoicePreferenceProps {
  gender: UserGender | null;
  voiceId: VoiceId;
  onGenderChange: (gender: UserGender) => void;
  onVoiceChange: (voiceId: VoiceId) => void;
  compact?: boolean;
}

export function VoicePreference({
  gender,
  voiceId,
  onGenderChange,
  onVoiceChange,
  compact = false,
}: VoicePreferenceProps) {
  const [previewing, setPreviewing] = useState<VoiceId | null>(null);

  const previewVoice = async (id: VoiceId) => {
    stopSpeaking();
    setPreviewing(id);
    track("voice_previewed", { voiceId: id });
    try {
      await speak("你好，我会陪你听见每一座城市的故事。", { voiceId: id });
    } catch {
      // A new preview or selection intentionally cancels the current sample.
    } finally {
      setPreviewing(null);
    }
  };

  return (
    <section className="space-y-3">
      {!compact && (
        <>
          <div>
            <h2 className="text-sm font-medium">先认识一下你</h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              只用来推荐初始声音，可随时更改
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="我的身份">
            {([
              ["male", "我是男生"],
              ["female", "我是女生"],
              ["unspecified", "暂不设置"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onGenderChange(value)}
                className={`rounded-lg border px-2 py-2.5 text-sm transition ${
                  gender === value
                    ? "border-[var(--accent)] bg-[var(--glow)] text-[var(--accent)]"
                    : "border-white/10 text-[var(--text-muted)] hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      <div>
        <div className="mb-2 text-xs text-[var(--text-muted)]">
          {compact ? "朗读声音" : "为你朗读"}
        </div>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="朗读声音">
          {(Object.keys(VOICE_PROFILES) as VoiceId[]).map((id) => {
            const profile = VOICE_PROFILES[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setPreviewing(null);
                  onVoiceChange(id);
                }}
                aria-pressed={voiceId === id}
                className={`rounded-lg border px-3 py-2.5 text-left transition ${
                  voiceId === id
                    ? "border-[var(--accent)] bg-[var(--glow)]"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                <span className="block text-sm font-medium">{profile.name}</span>
                <span className="block text-xs text-[var(--text-muted)]">{profile.label}</span>
              </button>
            );
          })}
        </div>
        {!compact && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(Object.keys(VOICE_PROFILES) as VoiceId[]).map((id) => (
              <button
                key={`preview-${id}`}
                type="button"
                onClick={() => previewVoice(id)}
                className="rounded-lg px-3 py-2 text-xs text-[var(--text-muted)] transition hover:bg-white/5 hover:text-[var(--text)]"
              >
                {previewing === id ? "正在试听…" : `试听${VOICE_PROFILES[id].name}`}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
