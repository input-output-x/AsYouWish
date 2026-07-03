export type StoryStyle =
  | "mythology"
  | "future"
  | "food"
  | "history"
  | "tech"
  | "all";

export interface StorySegment {
  id: string;
  title: string;
  content: string;
  mood?: string;
}

export interface StorySource {
  label: string;
  url: string;
}

export interface CityStory {
  city: string;
  style: StoryStyle;
  title: string;
  hook: string;
  segments: StorySegment[];
  estimatedMinutes: number;
  quality?: {
    curated: boolean;
    sources: StorySource[];
  };
}

export interface ARAnchor {
  poiId: string;
  lat: number;
  lng: number;
  segmentId: string;
  spatialAudio?: boolean;
}

export interface GenerateStoryRequest {
  city: string;
  style: StoryStyle;
  format?: "standard" | "ar";
}

export interface GenerateStoryResponse {
  story: CityStory;
  anchors?: ARAnchor[];
}

export interface StyleOption {
  id: StoryStyle;
  label: string;
  emoji: string;
  description: string;
}

export interface SavedStory extends CityStory {
  savedAt: string;
}

export type UserGender = "male" | "female" | "unspecified";
export type VoiceId = "female-warm" | "male-magnetic";
