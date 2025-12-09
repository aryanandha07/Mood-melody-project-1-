import { GoogleGenAI, Type } from "@google/genai";
import { MoodAnalysisResult, UserPreferences } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMoodAndGetPlaylist = async (base64Image: string, preferences: UserPreferences): Promise<MoodAnalysisResult> => {
  // Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: `Analyze the facial expression and emotional vibe of the person in this image.
            
            User Preferences:
            - Preferred Music Region: ${preferences.region}
            - Preferred Genre/Language: ${preferences.genreOrLanguage}

            1. Categorize the mood into exactly one of the following: Happy, Sad, Moody, Romantic, Joy, Stressed, Angry, Frustrated, Proud. If unsure, choose Neutral.
            2. Write a short, empathetic description of the mood you detect (max 1 sentence).
            3. Curate a playlist of 5 songs that perfectly matches this mood AND strictly follows the user's music preferences (${preferences.region} - ${preferences.genreOrLanguage}). Include title, artist, duration (e.g. 3:45), and a very short reason why it fits.`
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedMood: {
              type: Type.STRING,
              enum: ['Happy', 'Sad', 'Moody', 'Romantic', 'Joy', 'Stressed', 'Angry', 'Frustrated', 'Proud', 'Neutral']
            },
            moodDescription: {
              type: Type.STRING,
            },
            playlist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  artist: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ['title', 'artist', 'duration', 'reason']
              }
            }
          },
          required: ['detectedMood', 'moodDescription', 'playlist']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as MoodAnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};