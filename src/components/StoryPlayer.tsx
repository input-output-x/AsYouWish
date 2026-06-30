"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CityStory } from "@/lib/types";
import {
  isTTSSupported,
  pauseSpeaking,
  resumeSpeaking,
  speak,
  stopSpeaking,
} from "@/lib/tts";
import { VOICE_PROFILES } from "@/lib/tts";
import { STYLE_LABELS } from "@/lib/cities";
import type { VoiceId } from "@/lib/types";
import { VoicePreference } from "@/components/VoicePreference";
import { track } from "@/lib/analytics";

interface StoryPlayerProps {
  story: CityStory;
  onReset: () => void;
  onSave: (story: CityStory) => void;
  isSaved: boolean;
  voiceId: VoiceId;
  onVoiceChange: (voiceId: VoiceId) => void;
}

export function StoryPlayer({
  story,
  onReset,
  onSave,
  isSaved,
  voiceId,
  onVoiceChange,
}: StoryPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  const [ttsError, setTtsError] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const playbackRun = useRef(0);

  useEffect(() => {
    setTtsReady(isTTSSupported());
    return () => {
      playbackRun.current += 1;
      stopSpeaking();
    };
  }, []);

  const allText = [story.hook, ...story.segments.map((s) => s.content)];

  const playFrom = useCallback(
    async (index: number, run: number) => {
      if (run !== playbackRun.current) return;

      if (!ttsReady || index >= allText.length) {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentIndex(-1);
        if (index >= allText.length) {
          track("story_play_completed", { city: story.city, style: story.style });
        }
        return;
      }

      setCurrentIndex(index);
      setIsPlaying(true);
      setIsPaused(false);
      setTtsError("");

      try {
        await speak(allText[index], { voiceId });
        if (run !== playbackRun.current) return;
        await playFrom(index + 1, run);
      } catch {
        if (run === playbackRun.current) {
          setIsPlaying(false);
          setIsPaused(false);
          setTtsError("语音暂时没有播放成功");
        }
      }
    },
    [allText, story.city, story.style, ttsReady, voiceId]
  );

  const handleVoiceChange = (nextVoiceId: VoiceId) => {
    playbackRun.current += 1;
    stopSpeaking();
    setIsPlaying(false);
    setIsPaused(false);
    onVoiceChange(nextVoiceId);
  };

  const handlePlay = () => {
    if (isPaused && resumeSpeaking()) {
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    playbackRun.current += 1;
    const run = playbackRun.current;
    stopSpeaking();
    track("story_play_started", {
      city: story.city,
      style: story.style,
      voiceId,
    });
    playFrom(currentIndex > 0 ? currentIndex : 0, run);
  };

  const handleStop = () => {
    if (pauseSpeaking()) {
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }

    playbackRun.current += 1;
    stopSpeaking();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const playAt = (index: number) => {
    playbackRun.current += 1;
    const run = playbackRun.current;
    stopSpeaking();
    setIsPaused(false);
    playFrom(Math.max(0, Math.min(index, allText.length - 1)), run);
  };

  const handleRestart = () => playAt(0);
  const handlePrevious = () => playAt(Math.max(0, currentIndex - 1));
  const handleNext = () => playAt(Math.min(allText.length - 1, currentIndex + 1));

  const shareText = `${story.title}\n\n${story.hook}\n\n${story.segments
    .map((seg) => `${seg.title}：${seg.content}`)
    .join("\n\n")}`;

  const handleShare = async () => {
    setShareStatus("");

    try {
      const nav = window.navigator;

      if (typeof nav.share === "function") {
        await nav.share({
          title: story.title,
          text: `${story.hook}\n\n来自「想你所想」`,
          url: window.location.href,
        });
        track("story_shared", { city: story.city, method: "native" });
        setShareStatus("已打开分享");
        return;
      }

      await nav.clipboard.writeText(shareText);
      track("story_shared", { city: story.city, method: "clipboard" });
      setShareStatus("故事已复制");
    } catch {
      setShareStatus("分享未完成");
    }
  };

  const segmentIndex =
    currentIndex <= 0 ? -1 : Math.min(currentIndex - 1, story.segments.length - 1);
  const progress =
    currentIndex < 0 ? 0 : Math.min(100, Math.round(((currentIndex + 1) / allText.length) * 100));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center">
        <div className="text-sm text-[var(--accent)]">{story.city}</div>
        <h2 className="mt-1 text-2xl font-semibold">{story.title}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          约 {story.estimatedMinutes} 分钟 · {story.segments.length} 段 · {STYLE_LABELS[story.style]} · {VOICE_PROFILES[voiceId].name}朗读
        </p>
      </div>

      <VoicePreference
        gender={null}
        voiceId={voiceId}
        onGenderChange={() => undefined}
        onVoiceChange={handleVoiceChange}
        compact
      />

      <div className="overflow-hidden rounded-full bg-white/10">
        <div
          className="h-1.5 rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${progress}%` }}
        />
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

      <div>
        {isPlaying ? (
          <button
            type="button"
            onClick={handleStop}
            className="flex-1 rounded-xl border border-white/10 py-3 transition hover:bg-white/5"
          >
            暂停
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            disabled={!ttsReady}
            className="flex-1 rounded-xl bg-[var(--accent)] py-3 font-medium text-[var(--bg-deep)] transition hover:bg-[var(--accent-dim)] disabled:opacity-50"
          >
            {ttsReady
              ? (isPaused ? "继续朗读" : currentIndex > 0 ? "继续朗读" : `${VOICE_PROFILES[voiceId].name}为你朗读`)
              : "浏览器不支持语音"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex <= 0}
          className="rounded-lg border border-white/10 py-2 text-sm text-[var(--text-muted)] transition hover:bg-white/5 disabled:opacity-35"
        >
          上一段
        </button>
        <button
          type="button"
          onClick={handleRestart}
          className="rounded-lg border border-white/10 py-2 text-sm text-[var(--text-muted)] transition hover:bg-white/5"
        >
          从头播放
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex >= allText.length - 1}
          className="rounded-lg border border-white/10 py-2 text-sm text-[var(--text-muted)] transition hover:bg-white/5 disabled:opacity-35"
        >
          下一段
        </button>
      </div>

      {ttsError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-300">
          <span>{ttsError}</span>
          <button type="button" onClick={() => playAt(Math.max(0, currentIndex))} className="shrink-0 font-medium">
            重试
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onSave(story)}
          className={`rounded-xl border px-3 py-3 text-sm transition ${
            isSaved
              ? "border-[var(--accent)] bg-[var(--glow)] text-[var(--accent)]"
              : "border-white/10 text-[var(--text-muted)] hover:bg-white/5"
          }`}
        >
          {isSaved ? "已收藏" : "收藏"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="rounded-xl border border-white/10 px-3 py-3 text-sm text-[var(--text-muted)] transition hover:bg-white/5"
        >
          分享
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-white/10 px-3 py-3 text-sm text-[var(--text-muted)] transition hover:bg-white/5"
        >
          换城
        </button>
      </div>

      {shareStatus && (
        <p className="text-center text-xs text-[var(--text-muted)]">{shareStatus}</p>
      )}

      <p className="text-center text-xs leading-relaxed text-[var(--text-muted)]">
        本内容由 AI 生成，历史与地点信息可能存在误差，请以权威资料为准。
      </p>
    </div>
  );
}
