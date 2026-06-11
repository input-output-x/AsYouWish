const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

export interface GeoPosition {
  lat: number;
  lng: number;
}

export async function reverseGeocode(
  position: GeoPosition
): Promise<string | null> {
  const params = new URLSearchParams({
    lat: String(position.lat),
    lon: String(position.lng),
    format: "json",
    "accept-language": "zh",
    zoom: "10",
  });

  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { "User-Agent": "XiangNiSuoXiang/0.1" },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const address = data.address ?? {};

  return (
    address.city ??
    address.town ??
    address.county ??
    address.state ??
    null
  );
}

export function watchCityChanges(
  onCityChange: (city: string) => void,
  intervalMs = 60000
): () => void {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return () => {};
  }

  let lastCity: string | null = null;

  const check = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const city = await reverseGeocode({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        if (city && city !== lastCity) {
          lastCity = city;
          onCityChange(city);
        }
      },
      () => {},
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  check();
  const id = setInterval(check, intervalMs);
  return () => clearInterval(id);
}

export async function getCurrentCity(): Promise<string | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const city = await reverseGeocode({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        resolve(city);
      },
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 10000 }
    );
  });
}
