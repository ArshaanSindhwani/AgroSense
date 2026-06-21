# AgroSense

> Developed as part of a multidisciplinary team project at La Fosse Academy, with contributions focused on offline-first functionality, Firebase integration, AI-powered recommendations, and technical documentation.

AgroSense is an AI-powered mobile agriculture platform designed to help small farms make data-driven decisions through field observations, weather insights, and intelligent recommendations.

Built using React Native, Firebase, Firestore, OpenStreetMap, Gemini AI, AsyncStorage, and REST APIs, the application focuses on offline-first functionality for users operating in rural areas with limited connectivity.

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
- Weather API
- OpenStreetMap

### Development
- Git
- GitHub
- Agile Methodologies

## Key Features

- AI-generated farming recommendations
- Offline-first synchronisation
- Automatic sync when connectivity returns
- Weather integration
- Interactive field mapping
- Observation tracking
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
AsyncStorage Offline Storage
