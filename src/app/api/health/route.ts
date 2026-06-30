export function GET() {
  const provider = process.env.LLM_PROVIDER ?? "mock";
  const deepseekConfigured = Boolean(process.env.DEEPSEEK_API_KEY);
  const promptValue = process.env.STORY_PROMPT_CONFIG_BASE64;
  let promptConfigured = false;

  if (promptValue) {
    try {
      const parsed = JSON.parse(
        Buffer.from(promptValue, "base64").toString("utf8")
      );
      promptConfigured = Boolean(parsed.systemTemplate && parsed.userTemplate);
    } catch {
      promptConfigured = false;
    }
  }

  const configured =
    provider === "mock" ||
    (provider === "deepseek" && deepseekConfigured && promptConfigured) ||
    (provider === "openai" &&
      Boolean(process.env.OPENAI_API_KEY) &&
      promptConfigured);

  return Response.json({
    status: configured ? "ok" : "degraded",
    provider,
    checks: {
      llmKey: provider === "deepseek"
        ? deepseekConfigured
        : Boolean(process.env.OPENAI_API_KEY),
      prompt: promptConfigured,
    },
  });
}
