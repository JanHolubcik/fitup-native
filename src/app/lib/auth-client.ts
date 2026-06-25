import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const getBaseURL = () => {
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
        })
    ]
});