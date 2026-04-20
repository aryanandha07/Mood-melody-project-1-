# 🎵 MoodMelody AI — Emotion-Based Music Recommender

MoodMelody AI is a smart web application that detects a user's emotional state using webcam-based computer vision and recommends a personalized music playlist accordingly.

---

## 🚀 Features

- 🎥 **Real-Time Mood Detection**
  - Uses webcam to analyze facial expressions
  - Detects emotions like:
    - Happy 😊
    - Sad 😢
    - Angry 😠
    - Stressed 😓
    - Romantic ❤️
    - Frustrated 😤

- 🎶 **AI Music Recommendation**
  - Generates playlists based on mood
  - Integrates with YouTube for instant playback

- 🌍 **User Preference Personalization**
  - Choose:
    - Indian / Western / K-Pop
    - Languages (Hindi, Tamil, Malayalam, etc.)

- ▶️ **Built-in Music Player**
  - Auto-play songs
  - Next / Previous controls
  - Embedded YouTube player

---

## 🧩 Tech Stack

- Frontend: React + TypeScript
- AI Integration: Gemini API
- Computer Vision: Webcam-based emotion detection
- APIs: YouTube Embed API
- UI Components: Custom React components

---

## 📁 Project Structure

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Pexo7XfMs2WbmoY6dwLlvedhM1k0giMI

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
