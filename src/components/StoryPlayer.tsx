"use client";

import { useCallback, useEffect, useState } from "react";
import type { CityStory } from "@/lib/types";
import { speak, stopSpeaking, isTTSSupported } from "@/lib/tts";

interface StoryPlayerProps {
  story: CityStory;
  onReset: () => void;
}

export function StoryPlayer({ story, onReset }: StoryPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);

  useEffect(() => {
    setTtsReady(isTTSSupported());
  }, []);

  const allText = [story.hook, ...story.segments.map((s) => s.content)];

  const playFrom = useCallback(
    async (index: number) => {
      if (!ttsReady || index >= allText.length) {
        setIsPlaying(false);
        setCurrentIndex(-1);
        return;
      }

      setCurrentIndex(index);
      setIsPlaying(true);

      try {
        await speak(allText[index]);
        await playFrom(index + 1);
      } catch {
        setIsPlaying(false);
      }
    },
    [allText, ttsReady]
  );

  const handlePlay = () => {
    stopSpeaking();
    playFrom(0);
  };

  const handleStop = () => {
    stopSpeaking();
    setIsPlaying(false);
    setCurrentIndex(-1);
  };

  const segmentIndex =
    currentIndex <= 0 ? -1 : Math.min(currentIndex - 1, story.segments.length - 1);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <div className="text-sm text-[var(--accent)]">{story.city}</div>
        <h2 className="mt-1 text-2xl font-semibold">{story.title}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          约 {story.estimatedMinutes} 分钟 · {story.segments.length} 段 · 晓晓朗读
        </p>
      </div>

      <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--glow)] p-4">
        <div className="text-xs text-[var(--accent)]">开场</div>
        <p className="mt-1 leading-relaxed">{story.hook}</p>
      </div>

      <div className="space-y-3">
        {story.segments.map((seg, i) => (
          <div
            key={seg.id}
            className={`rounded-xl border p-4 transition-all ${
              segmentIndex === i
                ? "border-[var(--accent)] bg-[var(--glow)]"
                : "border-white/10 bg-[var(--bg-card)]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{seg.title}</span>
              {seg.mood && (
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-[var(--text-muted)]">
                  {seg.mood}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              {seg.content}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        {isPlaying ? (
          <button
            type="button"
            onClick={handleStop}
            className="flex-1 rounded-xl border border-white/10 py-3 transition hover:bg-white/5"
          >
            ⏹ 停止
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            disabled={!ttsReady}
            className="flex-1 rounded-xl bg-[var(--accent)] py-3 font-medium text-[var(--bg-deep)] transition hover:bg-[var(--accent-dim)] disabled:opacity-50"
          >
            {ttsReady ? "▶ 晓晓为你朗读" : "浏览器不支持语音"}
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-white/10 px-5 py-3 text-[var(--text-muted)] transition hover:bg-white/5"
        >
          换一座城
        </button>
      </div>
    </div>
  );
}
