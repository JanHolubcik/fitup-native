import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

export const getBaseURL = () => {
  if (__DEV__) {
    // Constants.expoConfig?.hostUri holds the host computer's IP address (e.g. 192.168.1.150:8081)
    const host = Constants.expoConfig?.hostUri?.split(":")[0];
    return host ? `http://${host}:3000` : "http://localhost:3000";
  }
  // TODO: Replace with your production server URL
  return "https://your-production-url.com";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(), 
  plugins: [
    expoClient({
      scheme: "heroui-native-app",
      storagePrefix: "myapp",
      storage: SecureStore,
    }),
    inferAdditionalFields({
      user: {
        goal: { type: "string", required: false, defaultValue: "maintainWeight" },
        weight: { type: "number", required: false },
        weightGoal: { type: "number", required: false },
        height: { type: "number", required: false },
        activityLevel: {
          type: "string",
          required: false,
          defaultValue: "lightlyActive",
        },
        targetCalories: { type: "number", required: false },
        targetProtein: { type: "number", required: false },
        targetCarbs: { type: "number", required: false },
        targetFat: { type: "number", required: false },
        targetSugar: { type: "number", required: false },
        manualOverride: { type: "boolean", required: false },
        guideSeen: { type: "boolean", defaultValue: false },
        termsAccepted: { type: "boolean", defaultValue: false },
      },
    }),
  ]
});