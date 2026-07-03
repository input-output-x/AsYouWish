import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import type { VoiceId } from "@/lib/types";
import { allowRequest, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const VOICES: Record<VoiceId, { voice: string; rate: number; pitch: string }> = {
  "female-warm": {
    voice: "zh-CN-XiaoxiaoNeural",
    rate: 0.92,
    pitch: "+0Hz",
  },
  "male-magnetic": {
    voice: "zh-CN-YunyangNeural",
    rate: 0.9,
    pitch: "-8Hz",
  },
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!allowRequest("tts", ip, 30, 60_000)) {
      return Response.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
    }

    const { text, voiceId } = (await req.json()) as {
      text?: string;
      voiceId?: VoiceId;
    };

    if (!text?.trim() || text.trim().length > 2_000) {
      return Response.json({ error: "text required" }, { status: 400 });
    }

    const selectedVoiceId: VoiceId =
      voiceId === "male-magnetic" ? "male-magnetic" : "female-warm";
    const profile = VOICES[selectedVoiceId];
    const envPrefix = selectedVoiceId === "male-magnetic" ? "TTS_MALE" : "TTS_FEMALE";
    const voice = process.env[`${envPrefix}_VOICE`] ?? profile.voice;
    const rate = parseFloat(process.env[`${envPrefix}_RATE`] ?? String(profile.rate));
    const pitch = process.env[`${envPrefix}_PITCH`] ?? profile.pitch;

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(escapeXml(text.trim()), { rate, pitch });

    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      audioStream.on("data", (data: Buffer) => chunks.push(Buffer.from(data)));
      audioStream.on("close", resolve);
      audioStream.on("error", reject);
    });

    return new Response(Buffer.concat(chunks), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "TTS failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
