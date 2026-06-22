# AgroSense

> Developed as part of a multidisciplinary team project at La Fosse Academy, with contributions focused on offline-compatible functionality, Firebase integration, AI-powered recommendations, and technical documentation.

AgroSense is an AI-powered mobile agriculture platform designed to help small farms make data-driven decisions through field observations, weather insights, and intelligent recommendations.

Built using React Native, Firebase, Firestore, OpenStreetMap, Gemini AI, AsyncStorage, and REST APIs, the application enables users to record observations in low-connectivity environments while automatically synchronising data when connectivity is restored.

## Technologies

### Frontend
- React Native
- Expo
- JavaScript

### Backend & Database
- Firebase Authentication
- Firestore
- AsyncStorage

### APIs & Integrations
- Gemini AI
- Open-Meteo API
- OpenStreetMap
- Postcodes.io API

### Development
- Git
- GitHub
- Agile Methodologies

## Key Features

- AI-powered farming recommendations
- Offline-compatible observation recording
- Automatic data synchronisation when connectivity returns
- Weather integration based on farm location
- Interactive field mapping with OpenStreetMap
- Observation tracking and history
- Recommendation history
- Firebase Authentication
- Firestore database integration

## User Workflow

1. Register and create an account
2. Add a farm using a UK postcode
3. Create fields and assign crop information
4. Record observations including growth stage, pests, and soil conditions
5. View weather information for field locations
6. Generate AI-powered farming recommendations
7. Review recommendation history and field performance

## Architecture

```text
React Native
      ↓
Firebase Authentication
      ↓
Firestore Database
      ↓
Weather API
      ↓
Gemini AI
      ↓
AsyncStorage
