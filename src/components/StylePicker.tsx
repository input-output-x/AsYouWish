"use client";

import { STYLE_OPTIONS } from "@/lib/cities";
import type { StoryStyle } from "@/lib/types";

interface StylePickerProps {
  value: StoryStyle;
  onChange: (style: StoryStyle) => void;
}

export function StylePicker({ value, onChange }: StylePickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm text-[var(--text-muted)]">叙事风格</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-xl border p-3 text-left transition-all ${
              value === opt.id
                ? "border-[var(--accent)] bg-[var(--glow)] animate-pulse-glow"
                : "border-white/10 bg-[var(--bg-card)] hover:border-white/20"
            }`}
          >
            <span className="text-xl">{opt.emoji}</span>
            <div className="mt-1 font-medium">{opt.label}</div>
            <div className="mt-0.5 text-xs text-[var(--text-muted)] line-clamp-2">
              {opt.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
