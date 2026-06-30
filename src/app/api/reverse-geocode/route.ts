import { NextRequest, NextResponse } from "next/server";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
const CACHE_TTL_MS = 1000 * 60 * 60;
const cache = new Map<string, { city: string | null; expiresAt: number }>();

function normalizeCoordinate(value: string | null, min: number, max: number): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
  return parsed;
}

function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(3)},${lng.toFixed(3)}`;
}

function pickCity(address: Record<string, string | undefined>): string | null {
  return (
    address.city ??
    address.town ??
    address.county ??
    address.state ??
    null
  );
}

export async function GET(req: NextRequest) {
  const lat = normalizeCoordinate(req.nextUrl.searchParams.get("lat"), -90, 90);
  const lng = normalizeCoordinate(req.nextUrl.searchParams.get("lng"), -180, 180);

  if (lat === null || lng === null) {
    return NextResponse.json({ error: "invalid coordinates" }, { status: 400 });
  }

  const key = cacheKey(lat, lng);
  const cached = cache.get(key);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return NextResponse.json({ city: cached.city, cached: true });
  }

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "json",
    "accept-language": "zh",
    zoom: "10",
  });

  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: {
      "User-Agent": "AsYouWish/0.1 contact=input-output-x",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ city: null }, { status: 502 });
  }

  const data = await res.json();
  const city = pickCity(data.address ?? {});
  cache.set(key, { city, expiresAt: now + CACHE_TTL_MS });

  return NextResponse.json({ city, cached: false });
}
