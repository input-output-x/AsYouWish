"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CitySelector } from "@/components/CitySelector";
import { StylePicker } from "@/components/StylePicker";
import { StoryPlayer } from "@/components/StoryPlayer";
import { ArrivalPrompt } from "@/components/ArrivalPrompt";
import { VoicePreference } from "@/components/VoicePreference";
import { watchCityChanges, getCurrentCity } from "@/lib/geolocation";
import { STYLE_LABELS } from "@/lib/cities";
import type { CityStory, SavedStory, StoryStyle, UserGender, VoiceId } from "@/lib/types";
import { track } from "@/lib/analytics";

const RECENT_KEY = "asyouwish.recentStories";
const FAVORITES_KEY = "asyouwish.favoriteStories";
const MAX_RECENT = 5;
const GENDER_KEY = "asyouwish.userGender";
const VOICE_KEY = "asyouwish.voiceId";

function recommendedVoice(gender: UserGender): VoiceId {
  if (gender === "male") return "female-warm";
  if (gender === "female") return "male-magnetic";
  return "female-warm";
}

function storyKey(story: Pick<CityStory, "city" | "style" | "title">): string {
  return `${story.city}:${story.style}:${story.title}`;
}

function readSavedStories(key: string): SavedStory[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSavedStories(key: string, stories: SavedStory[]) {
  window.localStorage.setItem(key, JSON.stringify(stories));
}

export default function HomePage() {
  const [city, setCity] = useState("");
  const [style, setStyle] = useState<StoryStyle>("all");
  const [story, setStory] = useState<CityStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [arrivalCity, setArrivalCity] = useState<string | null>(null);
  const [geoEnabled, setGeoEnabled] = useState(false);
  const [recentStories, setRecentStories] = useState<SavedStory[]>([]);
  const [favoriteStories, setFavoriteStories] = useState<SavedStory[]>([]);
  const [userGender, setUserGender] = useState<UserGender | null>(null);
  const [voiceId, setVoiceId] = useState<VoiceId>("female-warm");

  useEffect(() => {
    getCurrentCity().then((c) => {
      if (c) setCity(c);
    });
  }, []);

  useEffect(() => {
    setRecentStories(readSavedStories(RECENT_KEY));
    setFavoriteStories(readSavedStories(FAVORITES_KEY));
    const savedGender = window.localStorage.getItem(GENDER_KEY) as UserGender | null;
    const savedVoice = window.localStorage.getItem(VOICE_KEY) as VoiceId | null;
    if (savedGender) setUserGender(savedGender);
    if (savedVoice === "female-warm" || savedVoice === "male-magnetic") {
      setVoiceId(savedVoice);
    }
  }, []);

  const changeGender = (gender: UserGender) => {
    const nextVoice = recommendedVoice(gender);
    setUserGender(gender);
    setVoiceId(nextVoice);
    window.localStorage.setItem(GENDER_KEY, gender);
    window.localStorage.setItem(VOICE_KEY, nextVoice);
  };

  const changeVoice = (nextVoiceId: VoiceId) => {
    setVoiceId(nextVoiceId);
    window.localStorage.setItem(VOICE_KEY, nextVoiceId);
    track("voice_selected", { voiceId: nextVoiceId });
  };

  useEffect(() => {
    if (!geoEnabled) return;
    return watchCityChanges((newCity) => setArrivalCity(newCity));
  }, [geoEnabled]);

  const persistRecent = useCallback((nextStory: CityStory) => {
    const saved: SavedStory = { ...nextStory, savedAt: new Date().toISOString() };
    setRecentStories((prev) => {
      const next = [
        saved,
        ...prev.filter((item) => storyKey(item) !== storyKey(nextStory)),
      ].slice(0, MAX_RECENT);
      writeSavedStories(RECENT_KEY, next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((targetStory: CityStory) => {
    const saved: SavedStory = { ...targetStory, savedAt: new Date().toISOString() };
    setFavoriteStories((prev) => {
      const exists = prev.some((item) => storyKey(item) === storyKey(targetStory));
      const next = exists
        ? prev.filter((item) => storyKey(item) !== storyKey(targetStory))
        : [saved, ...prev].slice(0, 12);
      writeSavedStories(FAVORITES_KEY, next);
      track("story_favorite_toggled", {
        city: targetStory.city,
        saved: !exists,
      });
      return next;
    });
  }, []);

  const generate = useCallback(async (targetCity: string, targetStyle: StoryStyle) => {
    if (!targetCity.trim()) {
      setError("请先选择或输入城市");
      return;
    }

    setLoading(true);
    setError("");
    setStory(null);
    track("story_generate_started", {
      city: targetCity.trim(),
      style: targetStyle,
    });

    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: targetCity.trim(), style: targetStyle }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成失败");

      setStory(data.story);
      persistRecent(data.story);
      track("story_generate_succeeded", {
        city: targetCity.trim(),
        style: targetStyle,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
      track("story_generate_failed", {
        city: targetCity.trim(),
        style: targetStyle,
      });
    } finally {
      setLoading(false);
    }
  }, [persistRecent]);

  const handleArrivalAccept = () => {
    if (arrivalCity) {
      setCity(arrivalCity);
      generate(arrivalCity, style);
    }
    setArrivalCity(null);
  };

  const isCurrentSaved = useMemo(() => {
    if (!story) return false;
    return favoriteStories.some((item) => storyKey(item) === storyKey(story));
  }, [favoriteStories, story]);

  const openSavedStory = (saved: SavedStory) => {
    setCity(saved.city);
    setStyle(saved.style);
    setStory(saved);
    persistRecent(saved);
  };

  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          想你所<span className="text-[var(--accent)]">想</span>
        </h1>
        <p className="mt-2 text-[var(--text-muted)]">到一个城市，看见它的灵魂</p>
      </header>

      {story ? (
        <StoryPlayer
          story={story}
          onReset={() => setStory(null)}
          onSave={toggleFavorite}
          isSaved={isCurrentSaved}
          voiceId={voiceId}
          onVoiceChange={changeVoice}
        />
      ) : (
        <div className="space-y-8">
          <VoicePreference
            gender={userGender}
            voiceId={voiceId}
            onGenderChange={changeGender}
            onVoiceChange={changeVoice}
          />
          <CitySelector value={city} onChange={setCity} />
          <StylePicker value={style} onChange={setStyle} />

          {!geoEnabled && (
            <button
              type="button"
              onClick={() => setGeoEnabled(true)}
              className="w-full rounded-xl border border-dashed border-white/15 py-3 text-sm text-[var(--text-muted)] transition hover:border-[var(--accent)]/50 hover:text-[var(--text)]"
            >
              📍 开启定位 — 到达新城市时自动询问
            </button>
          )}

          {geoEnabled && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-2 text-sm text-green-400">
              定位已开启，到达新城市时将弹出询问
            </div>
          )}

          {error && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => generate(city, style)}
                className="shrink-0 font-medium"
              >
                重试
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => generate(city, style)}
            disabled={loading || !city.trim()}
            className="w-full rounded-xl bg-[var(--accent)] py-4 text-lg font-medium text-[var(--bg-deep)] transition hover:bg-[var(--accent-dim)] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[var(--bg-deep)] border-t-transparent" />
                正在生成故事…
              </span>
            ) : (
              "开始想你所想"
            )}
          </button>

          <p className="text-center text-xs text-[var(--text-muted)]">
            阶段 1 · 听 · 无需安装 App，打开即听
          </p>

          {(favoriteStories.length > 0 || recentStories.length > 0) && (
            <section className="space-y-4">
              {favoriteStories.length > 0 && (
                <SavedStoryList
                  title="收藏的城市"
                  stories={favoriteStories}
                  onSelect={openSavedStory}
                />
              )}

              {recentStories.length > 0 && (
                <SavedStoryList
                  title="最近听过"
                  stories={recentStories}
                  onSelect={openSavedStory}
                />
              )}
            </section>
          )}
        </div>
      )}

      {arrivalCity && (
        <ArrivalPrompt
          city={arrivalCity}
          onAccept={handleArrivalAccept}
          onDismiss={() => setArrivalCity(null)}
        />
      )}
    </main>
  );
}

function SavedStoryList({
  title,
  stories,
  onSelect,
}: {
  title: string;
  stories: SavedStory[];
  onSelect: (story: SavedStory) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-[var(--text-muted)]">{title}</div>
      <div className="space-y-2">
        {stories.map((saved) => (
          <button
            key={`${title}-${storyKey(saved)}-${saved.savedAt}`}
            type="button"
            onClick={() => onSelect(saved)}
            className="w-full rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-3 text-left transition hover:border-[var(--accent)]/40"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-medium">{saved.title}</span>
              <span className="shrink-0 text-xs text-[var(--accent)]">
                {STYLE_LABELS[saved.style]}
              </span>
            </div>
            <div className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)]">
              {saved.city} · {saved.hook}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
