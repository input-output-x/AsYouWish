import { allowRequest, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "story_generate_started",
  "story_generate_succeeded",
  "story_generate_failed",
  "story_play_started",
  "story_play_completed",
  "story_favorite_toggled",
  "story_shared",
  "story_feedback_submitted",
  "voice_selected",
  "voice_previewed",
]);

interface EventBody {
  event?: string;
  distinctId?: string;
  properties?: Record<string, string | number | boolean>;
}

function sanitizeProperties(properties: EventBody["properties"]) {
  if (!properties) return {};

  return Object.fromEntries(
    Object.entries(properties)
      .slice(0, 20)
      .map(([key, value]) => [
        key.slice(0, 40),
        typeof value === "string" ? value.slice(0, 500) : value,
      ])
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!allowRequest("events", ip, 60, 60_000)) {
    return Response.json({ error: "too many events" }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as EventBody | null;
  if (
    !body?.event ||
    !ALLOWED_EVENTS.has(body.event) ||
    !body.distinctId ||
    body.distinctId.length > 100
  ) {
    return Response.json({ error: "invalid event" }, { status: 400 });
  }

  const projectKey = process.env.POSTHOG_PROJECT_KEY;
  if (!projectKey) {
    return Response.json({ accepted: true, delivered: false });
  }

  const host = (process.env.POSTHOG_HOST ?? "https://us.i.posthog.com").replace(
    /\/$/,
    ""
  );
  const response = await fetch(`${host}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: projectKey,
      event: body.event,
      properties: {
        distinct_id: body.distinctId,
        ...sanitizeProperties(body.properties),
        $lib: "asyouwish-server",
      },
      timestamp: new Date().toISOString(),
    }),
    signal: AbortSignal.timeout(5_000),
  }).catch(() => null);

  return Response.json({
    accepted: true,
    delivered: Boolean(response?.ok),
  });
}
