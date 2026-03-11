export interface StimulusItem {
  trackId: string;
  artist?: string;
  title?: string;
  previewUrl?: string;
  durationMs?: number;
  source?: string;
  [key: string]: unknown;
}

export interface StimulusSetType {
  id: string;
  name: string;
  source?: string | null;
  items: StimulusItem[];
  createdAt: Date;
}

export interface ParticipantType {
  id: string;
  anonToken: string;
  consentTimestamp: Date;
  demographics?: Record<string, unknown> | null;
  createdAt: Date;
}

export interface SessionType {
  id: string;
  participantId: string;
  stimulusSetId: string;
  randomSeed?: number | null;
  createdAt: Date;
}
