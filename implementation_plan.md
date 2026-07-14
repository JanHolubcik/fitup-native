# Implement Onboarding Flow in React Native App

We want to build a high-fidelity, premium onboarding flow in the React Native (Expo Router) app, mirroring the Next.js app's multi-step form structure.

## User Review Required

> [!IMPORTANT]
> **Onboarding Trigger Condition:**
> We will add logic to `src/app/_layout.tsx` to detect if a logged-in user has *incomplete onboarding* (i.e. `!session.user.weight || !session.user.height`). If incomplete, they will be automatically redirected to `/onboarding`. Once completed, they will be redirected to `/(tabs)/dashboard`.

> [!TIP]
> **Mobile UI Enhancements:**
> 1. **Activity Level Picker:** In the Next.js web app, we used a dropdown select. For mobile, we will implement **highly touch-friendly card selectors** (just like the Goal step) instead of a small dropdown, creating a much better native experience.
> 2. **Step Animations:** We will implement smooth slide transitions between onboarding steps.

---

## Proposed Changes

### Routing & Guarding

#### [MODIFY] [_layout.tsx](file:///c:/Users/janho/Desktop/fitupexp/fitup-native/src/app/_layout.tsx)
* Add a redirect guard check: if `session` is active but `!session.user.weight && !session.user.height`, redirect to `/onboarding`.
* Register `<Stack.Screen name="onboarding" />` inside the root `<Stack>` component.

---

### Onboarding Screen Component

#### [NEW] [onboarding.tsx](file:///c:/Users/janho/Desktop/fitupexp/fitup-native/src/app/onboarding.tsx)
* Create the multi-step onboarding screen using arrow function syntax, Formik, and Zod validation schema (`onboardingSchema`).
* The screen will track the `step` index (0 to 3):
  * **Step 0: Welcome:** Illustrate main features (Daily Logging, Barcode Scanner, AI Food Analyzer) using nice icons and structured cards.
  * **Step 1: Goal:** Touch-friendly buttons to select between "Lose Fat", "Maintain", and "Build Muscle".
  * **Step 2: Details:** Custom inputs for Weight (kg) and Height (cm), plus a native picker or visual cards for Activity Level.
  * **Step 3: Review:** Display a summary of all selections.
* On submission: call `authClient.updateUser` to save the properties, then route the user to `/(tabs)/dashboard`.

---

## Verification Plan

### Manual Verification
1. Login with a test user that has no weight/height configured.
2. Confirm the app redirects to the `/onboarding` screen.
3. Step through the onboarding, verifying:
   * Validation errors (e.g. leaving weight empty or below 50kg shows validation labels).
   * Back and Continue button states.
   * Selection indicators (visual state highlights when a goal or activity is tapped).
4. Tap "Complete Setup" and verify the user data updates, the session updates, and the app redirects to `/(tabs)/dashboard`.
