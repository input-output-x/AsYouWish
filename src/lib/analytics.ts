export type AnalyticsEvent =
  | "story_generate_started"
  | "story_generate_succeeded"
  | "story_generate_failed"
  | "story_play_started"
  | "story_play_completed"
  | "story_favorite_toggled"
  | "story_shared"
  | "story_feedback_submitted"
  | "voice_selected"
  | "voice_previewed";

interface AnalyticsEntry {
  event: AnalyticsEvent;
  at: string;
  data?: Record<string, string | number | boolean>;
}

const ANALYTICS_KEY = "asyouwish.analytics";
const MAX_EVENTS = 200;
const ANONYMOUS_ID_KEY = "asyouwish.anonymousId";

function getAnonymousId(): string {
  const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);
  if (existing) return existing;

  const id = window.crypto.randomUUID();
  window.localStorage.setItem(ANONYMOUS_ID_KEY, id);
  return id;
}

export function track(
  event: AnalyticsEvent,
  data?: AnalyticsEntry["data"]
): void {
  if (typeof window === "undefined") return;

  try {
    const stored = window.localStorage.getItem(ANALYTICS_KEY);
    const entries: AnalyticsEntry[] = stored ? JSON.parse(stored) : [];
    entries.push({ event, at: new Date().toISOString(), data });
    window.localStorage.setItem(
      ANALYTICS_KEY,
      JSON.stringify(entries.slice(-MAX_EVENTS))
    );

    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        distinctId: getAnonymousId(),
        properties: data,
      }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Analytics must never interrupt the listening experience.
  }
}
