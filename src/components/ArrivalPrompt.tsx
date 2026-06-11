"use client";

interface ArrivalPromptProps {
  city: string;
  onAccept: () => void;
  onDismiss: () => void;
}

export function ArrivalPrompt({ city, onAccept, onDismiss }: ArrivalPromptProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="animate-fade-in w-full max-w-md rounded-2xl border border-[var(--accent)]/30 bg-[var(--bg-card)] p-6 shadow-2xl">
        <div className="mb-1 text-sm text-[var(--accent)]">📍 到达新城市</div>
        <h2 className="text-xl font-semibold">
          是否播放「{city}」的一切？
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          吃喝玩乐、故事、神话、未来……选一个风格，马上开始。
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onAccept}
            className="flex-1 rounded-xl bg-[var(--accent)] py-3 font-medium text-[var(--bg-deep)] transition hover:bg-[var(--accent-dim)]"
          >
            播放
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-xl border border-white/10 px-5 py-3 text-[var(--text-muted)] transition hover:bg-white/5"
          >
            稍后
          </button>
        </div>
      </div>
    </div>
  );
}
