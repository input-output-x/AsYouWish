import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

export const runtime = "nodejs";

/** 温柔年轻女声 · 约 25 岁 */
const DEFAULT_VOICE = "zh-CN-XiaoxiaoNeural";
const DEFAULT_RATE = 0.92;
const DEFAULT_PITCH = "+0Hz";

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
    const { text } = (await req.json()) as { text?: string };

    if (!text?.trim()) {
      return Response.json({ error: "text required" }, { status: 400 });
    }

    const voice = process.env.TTS_VOICE ?? DEFAULT_VOICE;
    const rate = parseFloat(process.env.TTS_RATE ?? String(DEFAULT_RATE));
    const pitch = process.env.TTS_PITCH ?? DEFAULT_PITCH;

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
