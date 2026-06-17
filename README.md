# AgroSense

AgroSense is a mobile app for UK small farms to manage fields, log crop observations, and receive AI-powered recommendations based on live weather and soil conditions.

## Using the App

### Getting Started

Register with your email and a password. Your account is linked to your farm data, so everything you add will be there the next time you log in. If you forget your password, contact your team admin to reset it from the Firebase console.

### Adding a Farm

Tap **Add Farm** and enter a name and UK postcode. AgroSense uses the postcode to fetch live weather for your location, so make sure it is accurate. You can enter the farm size in hectares or acres, or leave it blank.

### Adding Fields

Once you have a farm, tap the **Fields** tab and use the add button to create a field. AgroSense looks up coordinates from the postcode you provide, saves soil and weather data for the field's location, and registers a boundary polygon with the AgroMonitoring satellite service for future crop monitoring. The full chain takes a few seconds.

### Logging Observations

Open a field from the fields list or tap **Observations** in the tab bar. Each observation captures the crop's growth stage, any pest or disease sightings, soil condition, and free-text notes.

Observations work offline. If you are out in the field without signal, AgroSense queues your entry and syncs it to the cloud the next time you are connected. You will see a network indicator at the top of the screen when the app is offline.

### Getting AI Recommendations

Go to the **Advice** tab, select a field, and choose an observation to base the recommendation on. AgroSense sends the field's current weather and soil data along with the observation to Google Gemini and returns a tailored crop recommendation. This requires an internet connection.

### Dashboard

The home screen shows your selected farm, current weather conditions, and a map of your selected field. Tap a different farm or field to switch context. You can also delete a farm from this screen using the trash icon, which will prompt you to confirm before removing it.

### Settings

Toggle dark mode from the Settings tab, or switch back to following your device's system setting. Tap **Log out** when you are done.

---

## Developing the App

### Prerequisites

You will need the following before you can run the project locally.

- **Node.js 22.** The EAS build configuration is pinned to Node 22.13.0, so matching that locally avoids surprises.
- **Java Development Kit 17** for Android builds. Android Studio installs this for you if you use the bundled JDK.
- **Android Studio** with the Android SDK and an emulator configured, or **Xcode 15+** on macOS for iOS.
- An **Expo account** at expo.dev if you plan to run EAS cloud builds.
- A **Firebase project** with Email/Password Authentication and Firestore enabled.

### 1. Clone and install dependencies

```bash
git clone https://github.com/0BluSky0/project-gamma.git
cd project-gamma
npm install
```

### 2. Add the Firebase config file

`@react-native-firebase` requires the native Google Services config to connect to Firebase. Go to your Firebase project's console, open **Project Settings**, scroll to **Your apps**, select the Android app, and download `google-services.json`. Place this file in the project root alongside `package.json`. It is listed in `.gitignore` and must never be committed.

### 3. Set up environment variables

Create a `.env` file in the project root. The two values that require API keys are:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
EXPO_PUBLIC_AGROMONITORING_API_KEY=your_key_here
```

The weather service (Open-Meteo) and postcode lookup (postcodes.io) are free and work without a key. Gemini keys are available from [Google AI Studio](https://aistudio.google.com). AgroMonitoring keys are available from [agromonitoring.com](https://agromonitoring.com).

### 4. Run on a device or emulator

Because the app uses `@react-native-firebase`, it requires a **native build** and will not run in Expo Go. The first build compiles native Android or iOS code, which takes several minutes. Subsequent starts use the cached build and are much faster.

For Android:

```bash
npx expo run:android
```

For iOS (macOS only):

```bash
npx expo run:ios
```

Metro bundler starts automatically. You can also start it separately with `npx expo start` and then press `a` or `i` to launch on the connected device or emulator.

### 5. EAS builds

The project is configured for three EAS build profiles.

A **development** build is a shareable APK or IPA with the dev client included. It behaves like a local native build and lets your team install the app without needing Xcode or Android Studio.

A **preview** build is a distributable internal release for QA testing, without the dev client overhead.

A **production** build is the release-ready version.

To trigger a build you must be logged into the Expo account that owns the `projectgamma` EAS project. Then:

```bash
npx eas build --profile development --platform android
npx eas build --profile preview --platform android
npx eas build --profile production --platform android
```

### Project Structure

The app uses Expo Router for file-based routing. Every file inside `app/` is a route.

```
app/
  (auth)/          Login and register screens
  (tabs)/          Tab navigator: dashboard, fields, observations,
                   recommendations, settings
  add-farm.jsx     Push screen for adding a farm
  add-field.jsx    Push screen for adding a field
  add-observation  Push screen for adding an observation
  field-details    Push screen showing a field's full detail

components/
  cards/           FarmCard, FieldCard, ObservationCard,
                   RecommendationCard, WeatherCard
  charts/          CropHealthChart, WeatherTrendChart
  forms/           AddFarmForm, AddFieldForm, LoginForm,
                   ObservationForm, RegisterForm
  maps/            FieldLocationMap (Leaflet via WebView)
  shared/          ErrorMessage, Header, LoadingSpinner,
                   NetworkIndicator

services/
  firebase/        Firestore CRUD and Firebase Auth wrappers
  external/        Weather, postcode, soil, and AgroMonitoring APIs
  ai/              Gemini recommendation generation
  offline/         Queue-based sync layer for offline writes

context/           AuthContext, FarmContext, ThemeContext
constants/         Theme values, colour tokens, and API config
hooks/             useAuth, useColorScheme, useNetworkStatus, useThemeColor
```

### Branching

`main` is the production branch. `dev` is the integration branch where all feature work lands after review. `testing` is used for QA before merging to main. Branch names should follow `feature/your-feature` and be opened as pull requests into `dev`. Avoid pushing directly to `dev` or `main`.

### Running Tests

```bash
npm run coverage
```

This runs the full unit test suite and generates a coverage report in the `coverage/` folder. There are 83 tests across 6 suites covering auth, Firestore operations, external API services, the observation form, and the add-farm screen. To run tests in watch mode during development:

```bash
npm run unitTests
```