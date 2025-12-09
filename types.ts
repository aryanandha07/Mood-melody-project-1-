export enum Mood {
  Happy = 'Happy',
  Sad = 'Sad',
  Moody = 'Moody',
  Romantic = 'Romantic',
  Joy = 'Joy',
  Stressed = 'Stressed',
  Angry = 'Angry',
  Frustrated = 'Frustrated',
  Proud = 'Proud',
  Neutral = 'Neutral'
}

export interface Song {
  title: string;
  artist: string;
  reason: string;
  duration: string;
}

export interface MoodAnalysisResult {
  detectedMood: Mood;
  moodDescription: string;
  playlist: Song[];
}

export interface UserPreferences {
  region: string;
  genreOrLanguage: string;
}

export type AppState = 'intro' | 'preferences' | 'camera' | 'analyzing' | 'results' | 'error';