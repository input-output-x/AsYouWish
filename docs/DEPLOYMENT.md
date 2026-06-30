# Deployment

## Recommended Target

Render Web Service is the recommended V1 target. It runs the app as a persistent
Node.js service, which fits the streaming Edge TTS route better than a
serverless-only deployment.

The repository includes `render.yaml`. Connect the GitHub repository in Render,
then create the service from the Blueprint.

## Environment Variables

Required for mock demo:

```bash
LLM_PROVIDER=mock
NEXT_PUBLIC_TTS_PROVIDER=edge
```

Optional real generation:

```bash
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=...
DEEPSEEK_MODEL=deepseek-chat
STORY_PROMPT_CONFIG_BASE64=...
```

or:

```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
```

TTS:

```bash
TTS_FEMALE_VOICE=zh-CN-XiaoxiaoNeural
TTS_FEMALE_RATE=0.92
TTS_FEMALE_PITCH=+0Hz
TTS_MALE_VOICE=zh-CN-YunyangNeural
TTS_MALE_RATE=0.90
TTS_MALE_PITCH=-8Hz
```

## Preflight

Run locally before deployment:

```bash
npm run build
```

Manual checks:

- Generate one mock story.
- Enable location and confirm no browser console error blocks the app.
- Play, pause, continue, and restart audio.
- Favorite a story, reload, and confirm it remains.
- Share a story.

## Launch Notes

- Add a public URL to `README.md` once deployed.
- Keep `LLM_PROVIDER=mock` for demos if API cost or reliability is uncertain.
- Store `DEEPSEEK_API_KEY` and `STORY_PROMPT_CONFIG_BASE64` only as Render secrets.
- Move rate limiting to a durable store before broad public traffic.
