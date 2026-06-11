"use client";

import { useCallback, useEffect, useState } from "react";
import { CitySelector } from "@/components/CitySelector";
import { StylePicker } from "@/components/StylePicker";
import { StoryPlayer } from "@/components/StoryPlayer";
import { ArrivalPrompt } from "@/components/ArrivalPrompt";
import { watchCityChanges, getCurrentCity } from "@/lib/geolocation";
import type { CityStory, StoryStyle } from "@/lib/types";

export default function HomePage() {
  const [city, setCity] = useState("");
  const [style, setStyle] = useState<StoryStyle>("all");
  const [story, setStory] = useState<CityStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [arrivalCity, setArrivalCity] = useState<string | null>(null);
  const [geoEnabled, setGeoEnabled] = useState(false);

  useEffect(() => {
    getCurrentCity().then((c) => {
      if (c) setCity(c);
    });
  }, []);

  useEffect(() => {
    if (!geoEnabled) return;
    return watchCityChanges((newCity) => setArrivalCity(newCity));
  }, [geoEnabled]);

  const generate = useCallback(async (targetCity: string, targetStyle: StoryStyle) => {
    if (!targetCity.trim()) {
      setError("请先选择或输入城市");
      return;
    }

    setLoading(true);
    setError("");
    setStory(null);

    try {
      const res = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: targetCity.trim(), style: targetStyle }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成失败");

      setStory(data.story);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleArrivalAccept = () => {
    if (arrivalCity) {
      setCity(arrivalCity);
      generate(arrivalCity, style);
    }
    setArrivalCity(null);
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
        <StoryPlayer story={story} onReset={() => setStory(null)} />
      ) : (
        <div className="space-y-8">
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
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm text-red-400">
              {error}
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
