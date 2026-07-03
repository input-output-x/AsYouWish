const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function allowRequest(
  namespace: string,
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const bucketKey = `${namespace}:${key}`;
  const now = Date.now();
  const current = buckets.get(bucketKey);

  if (!current || now >= current.resetAt) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
