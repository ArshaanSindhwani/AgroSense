# AgroSense

> Developed as part of a multidisciplinary team project at La Fosse Academy, with contributions focused on offline-compatible functionality, Firebase integration, AI-powered recommendations, and technical documentation.

AgroSense is an AI-powered mobile agriculture platform designed to help small farms make data-driven decisions through field observations, weather insights, and intelligent recommendations.

Built using React Native, Expo, Firebase, Firestore, OpenStreetMap, Gemini AI, AsyncStorage, and REST APIs, the application enables users to continue recording observations in low-connectivity environments while automatically synchronising data when connectivity is restored.

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
- Open-Meteo Weather API
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
- Theme customisation
- Safe fallback handling for unavailable weather or map data

## User Workflow

1. Register and create an account
2. Add a farm using a UK postcode
3. Create fields and assign crop information
4. Record observations including growth stage, pests, and soil conditions
5. View weather information for field locations
6. Generate AI-powered recommendations
7. Review recommendation history and field performance

## Architecture

```text
React Native
      ↓
Firebase Authentication
      ↓
Firestore Database
      ↓
Open-Meteo Weather API
      ↓
Gemini AI
      ↓
AsyncStorage Local Storage
```

## My Contribution

I contributed to the development and debugging of the AgroSense mobile application, focusing on offline-compatible functionality, Firebase integration, dashboard behaviour, weather and map fallback logic, route handling, and technical documentation.

I also worked on documenting and explaining the AI integration, weather API integration, OpenStreetMap implementation, and synchronisation architecture used throughout the application.

## Screenshots

<table>
  <tr>
    <td align="center" width="33%">
      <strong>Login</strong><br><br>
      <img src="screenshots/login.jpg" width="220"><br><br>
      Secure user authentication using Firebase Authentication.
    </td>
    <td align="center" width="33%">
      <strong>Dashboard</strong><br><br>
      <img src="screenshots/dashboard.jpg" width="220"><br><br>
      Overview of farms, weather insights, and key farming information.
    </td>
    <td align="center" width="33%">
      <strong>Fields</strong><br><br>
      <img src="screenshots/fields.jpg" width="220"><br><br>
      Manage fields, crop information, and location data.
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <strong>Observations</strong><br><br>
      <img src="screenshots/observations.jpg" width="220"><br><br>
      Record and review field observations, growth stages, and conditions.
    </td>
    <td align="center" width="33%">
      <strong>AI Recommendations</strong><br><br>
      <img src="screenshots/recommendations.jpg" width="220"><br><br>
      Generate AI-powered farming recommendations using Gemini AI.
    </td>
    <td align="center" width="33%">
      <strong>Offline-Compatible Functionality</strong><br><br>
      <img src="screenshots/offline-compatible.jpg" width="220"><br><br>
      Continue working without connectivity and synchronise data when a connection is restored.
    </td>
  </tr>
</table>

## What I Learned

- Mobile application development with React Native and Expo
- Firebase Authentication and Firestore integration
- AI integration using Gemini
- Offline-compatible application design and synchronisation
- API integration and data handling
- OpenStreetMap implementation using WebView
- State management and navigation with Expo Router
- Defensive UI handling for unavailable external API data
- Agile team collaboration and technical presentation delivery

## Future Improvements

- Enhanced analytics dashboard
- Postcode validation during farm and field creation
- Advanced AI recommendation capabilities
- Additional weather insights and forecasting
- Improved synchronisation conflict handling
- Farm performance reporting and analytics
