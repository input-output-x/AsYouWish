export interface GeoPosition {
  lat: number;
  lng: number;
}

export async function reverseGeocode(
  position: GeoPosition
): Promise<string | null> {
  const params = new URLSearchParams({
    lat: String(position.lat),
    lng: String(position.lng),
  });

  const res = await fetch(`/api/reverse-geocode?${params}`);

  if (!res.ok) return null;

  const data = await res.json();
  return data.city ?? null;
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
