# AsYouWish V1 PRD

## Goal

V1 turns a city arrival into a short, listenable story session. The product should work without an app install: open the web page, pick or detect a city, generate a story, listen, save, and share.

## Target User

- A traveler who has just arrived in a city.
- A passenger in a car, train, or taxi who wants a quick sense of place.
- A local creator testing city story formats before deeper AR or vehicle integrations.

## Core Journey

1. User opens the web app.
2. The app asks for location permission and tries to detect the current city.
3. User chooses a city and narrative style.
4. The app generates a structured story.
5. User listens with TTS, pauses, resumes, restarts, saves, or shares.
6. Saved and recent stories remain available on the same device.

## V1 Scope

- City selection across mainland China prefecture-level cities.
- Six story styles: all, mythology, future, food, history, tech.
- Mock generation by default, with DeepSeek/OpenAI support through env vars.
- TTS playback through Edge neural voice with browser fallback.
- Recent stories and favorites stored in localStorage.
- Native Web Share when supported, clipboard fallback otherwise.
- Server-side reverse geocode proxy with lightweight caching.

## Out Of Scope

- VR.
- Full AR camera layer.
- User accounts and cloud sync.
- Paid content.
- Turn-by-turn navigation.
- Real-time POI recommendations.

## Acceptance Checklist

- A first-time user can generate and hear a story in under 60 seconds.
- The app still works in mock mode without API keys.
- TTS failure does not block reading the story text.
- A generated story appears in Recent.
- A favorited story appears in Favorites after page reload.
- Share opens the system share sheet or copies story text.
- Location detection calls the local `/api/reverse-geocode` endpoint, not Nominatim directly from the browser.

## V2 Direction

V2 should be AR-lite, not VR: map and camera-adjacent overlays, real POI anchors, and spatial audio prompts. The product's strength is augmenting the real city, not replacing it with a virtual one.
