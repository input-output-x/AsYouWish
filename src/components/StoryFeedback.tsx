"use client";

import { useState } from "react";
import type { CityStory } from "@/lib/types";
import { track } from "@/lib/analytics";

type FeedbackChoice = "liked" | "inaccurate" | "boring";

const CHOICES: Array<{ id: FeedbackChoice; label: string }> = [
  { id: "liked", label: "喜欢" },
  { id: "inaccurate", label: "有不准确" },
  { id: "boring", label: "没意思" },
];

export function StoryFeedback({ story }: { story: CityStory }) {
  const [choice, setChoice] = useState<FeedbackChoice | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!choice) return;
    track("story_feedback_submitted", {
      city: story.city,
      style: story.style,
      storyTitle: story.title,
      rating: choice,
      comment: comment.trim().slice(0, 500),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border-t border-white/10 pt-5 text-center text-sm text-[var(--text-muted)]">
        已收到，谢谢你的判断。
      </div>
    );
  }

  return (
    <section className="space-y-3 border-t border-white/10 pt-5">
      <div className="text-sm font-medium">这个故事怎么样？</div>
      <div className="grid grid-cols-3 gap-2" role="group" aria-label="故事评价">
        {CHOICES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setChoice(item.id)}
            aria-pressed={choice === item.id}
            className={`rounded-lg border px-2 py-2.5 text-sm transition ${
              choice === item.id
                ? "border-[var(--accent)] bg-[var(--glow)] text-[var(--accent)]"
                : "border-white/10 text-[var(--text-muted)] hover:bg-white/5"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {choice && (
        <>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value.slice(0, 500))}
            placeholder="可以补充哪里好、哪里不准确（选填）"
            rows={3}
            className="w-full resize-none rounded-lg border border-white/10 bg-[var(--bg-card)] px-3 py-2 text-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]/60"
          />
          <button
            type="button"
            onClick={submit}
            className="w-full rounded-lg bg-white/10 py-2.5 text-sm font-medium transition hover:bg-white/15"
          >
            提交反馈
          </button>
        </>
      )}
    </section>
  );
}
