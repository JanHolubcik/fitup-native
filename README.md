# 🥗 Fitup Native (Expo Calorie Tracker)

[![Expo](https://img.shields.io/badge/Expo-SDK%2051-black?logo=expo&style=flat-square)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue?logo=react&style=flat-square)](https://reactnative.dev/)
[![HeroUI](https://img.shields.io/badge/HeroUI--Native-latest-orange?style=flat-square)](https://heroui.com/docs/native)
[![Uniwind](https://img.shields.io/badge/Uniwind-Tailwind-38B2AC?style=flat-square)](https://docs.uniwind.dev)

This is the mobile application version of the **Fitup Calorie & Physical Activity Tracker** project, ported from the original [Next.js web application](https://github.com/JanHolubcik/Fitupjh). It is built using **Expo**, **React Native**, **HeroUI Native**, and **Tailwind CSS (via Uniwind)** with a bottom-tab layout.

---

## Features

TODO: Once they are implemented, they will be checked.

- [ ] **Calorie & Macro Logging Dashboard**: Keep track of daily meals classified by category timeframe. Track total protein, carbs, fats, fiber, sugar, and salt against personalized daily targets.
- [ ] **Gemini AI Integration**:
  - [ ] **AI Food Intake Analyzer**: Evaluates daily meals to praise healthy habits, issue warnings, and suggest healthier food alternatives (using structured markup).
  - [ ] **AI Food Image Recognition**: Snap or upload a photo of your meal to have the AI identify the dish and estimate its nutritional macro.
- [ ] **Hybrid Barcode Scanner**:
  - [ ] Uses the browser's native **BarcodeDetector API** (or mobile camera equivalent) for high performance with a fallback to the **ZXing WebAssembly scanner** (`@yudiel/react-qr-scanner`).
  - [ ] Supports EAN-13, EAN-8, and UPC-A formats.
  - [ ] Queries local database catalog first; if not found, it calls the **Open Food Facts API**, maps nutritional data, seeds it locally, and logs it.
- [ ] **Physical Activity & Exercise Tracker**: Log activities (Cardio, Strength, Flexibility, Sports) with MET (Metabolic Equivalent of Task) values to automatically calculate active calorie burn based on user weight.
- [ ] **Interactive Onboarding Tour**: Guided tours to help new users step-by-step through the application dashboard.
- [ ] **Internationalization (i18n)**: Fully supports dynamic locale routing/configuration for **English** and **Slovak** (`sk`).
- [ ] **Secure Authentication**: Implemented via **Better-Auth** supporting email/password and social OAuth providers (Google, GitHub, Discord).

---

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. The tabs themselves live under `src/app/(tabs)/`. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Tech Stack (Expo App)

- **HeroUI Native** (`heroui-native`) wrapped in `HeroUINativeProvider` and `GestureHandlerRootView` in `src/app/_layout.tsx`
- **Uniwind** + **Tailwind CSS** wired through `metro.config.js` and `src/global.css`
- All HeroUI Native mandatory peer dependencies: `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets`, `react-native-safe-area-context`, `react-native-svg`, `react-native-screens`
- `@gorhom/bottom-sheet` for bottom-sheet UIs
- `@expo/vector-icons` (Ionicons) for tab bar icons
- TypeScript with `strict: true` and `@/*` path alias to `./src/*`
- React Compiler enabled

## Learn more

- [HeroUI Native components](https://heroui.com/docs/native) — full component reference
- [Expo documentation](https://docs.expo.dev/) — Expo fundamentals and guides
- [Uniwind documentation](https://docs.uniwind.dev) — Tailwind for React Native
- [Expo Router](https://docs.expo.dev/router/introduction) — file-based routing
