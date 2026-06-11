"use client";

import { useMemo, useState } from "react";
import {
  REGIONS,
  ALL_CITIES,
  normalizeCityName,
  REGION_TYPE_LABELS,
} from "@/lib/regions";

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
}

export function CitySelector({ value, onChange }: CitySelectorProps) {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return null;

    const lower = q.toLowerCase();
    return ALL_CITIES.filter(
      (city) =>
        city.includes(q) ||
        normalizeCityName(city).includes(q) ||
        city.toLowerCase().includes(lower)
    );
  }, [search]);

  const toggleRegion = (name: string) => {
    setExpandedRegion((prev) => (prev === name ? null : name));
    setSearch("");
  };

  const selectCity = (city: string) => {
    onChange(normalizeCityName(city));
    setSearch("");
  };

  const isSelected = (city: string) => {
    const n = normalizeCityName(city);
    return value === n || value === city || value + "市" === city;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm text-[var(--text-muted)]">选择或输入城市</label>

      <input
        type="text"
        value={search || value}
        onChange={(e) => {
          const v = e.target.value;
          setSearch(v);
          onChange(v);
        }}
        onFocus={() => {
          if (value && !search) setSearch(value);
        }}
        placeholder="搜索城市，如：合肥、蚌埠…"
        className="w-full rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none"
      />

      {/* 搜索结果 */}
      {filtered && (
        <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-[var(--bg-card)] p-2">
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-sm text-[var(--text-muted)]">未找到匹配城市</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filtered.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => selectCity(city)}
                  className={`rounded-full px-3 py-1.5 text-sm transition-all ${
                    isSelected(city)
                      ? "bg-[var(--accent)] font-medium text-[var(--bg-deep)]"
                      : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text)]"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 按省划分 */}
      {!filtered && (
        <div className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-white/10 bg-[var(--bg-card)] p-2">
          {REGIONS.map((region) => {
            const isOpen = expandedRegion === region.name;
            const typeLabel = REGION_TYPE_LABELS[region.type];
            const isMunicipality = region.type === "municipality";

            return (
              <div key={region.name}>
                <button
                  type="button"
                  onClick={() => {
                    if (isMunicipality) {
                      selectCity(region.cities[0]);
                    } else {
                      toggleRegion(region.name);
                    }
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-white/5 ${
                    isMunicipality && isSelected(region.cities[0])
                      ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                      : isOpen
                        ? "text-[var(--text)]"
                        : "text-[var(--text-muted)]"
                  }`}
                >
                  <span>
                    {region.name}
                    {!isMunicipality && (
                      <span className="ml-2 text-xs opacity-60">
                        {region.cities.length} 个城市
                      </span>
                    )}
                  </span>
                  <span className="text-xs opacity-50">
                    {isMunicipality ? typeLabel : isOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isOpen && !isMunicipality && (
                  <div className="flex flex-wrap gap-1.5 px-2 pb-2 pt-1">
                    {region.cities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => selectCity(city)}
                        className={`rounded-full px-2.5 py-1 text-xs transition-all ${
                          isSelected(city)
                            ? "bg-[var(--accent)] font-medium text-[var(--bg-deep)]"
                            : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text)]"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-[var(--text-muted)]">
        全国 {ALL_CITIES.length} 个地级城市 · 按省划分
      </p>
    </div>
  );
}
