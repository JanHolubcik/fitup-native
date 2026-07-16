import { useEffect, useMemo } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, View, Platform } from "react-native";
import { authClient, getBaseURL } from "../lib/auth-client";
import { getAuthHeaders } from "../lib/api-client";
import { useUniwind } from "uniwind";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/query-client";

import "../global.css";
import "../i18n/i18n";

// Patch global fetch to resolve relative URLs and attach session headers in native environment
if (Platform.OS !== "web") {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    let url = typeof input === "string" ? input : input.toString();
    const baseUrl = (getBaseURL() || "").replace(/\/$/, "");

    // Stricter domain checks to prevent leaking credentials to third-party APIs
    const isRelative = url.startsWith("/");
    const isLocalApi = isRelative || (baseUrl && url.startsWith(baseUrl));

    if (isRelative) {
      url = `${baseUrl}${url}`;
    }

    // Auto-inject session/auth headers ONLY for requests to our own backend /api endpoints
    if (isLocalApi && url.includes("/api/")) {
      const authHeaders = getAuthHeaders();
      const mergedHeaders = {
        ...authHeaders,
        ...(init?.headers || {}),
      };
      init = {
        ...(init || {}),
        headers: mergedHeaders,
      };
    }

    return originalFetch(url, init);
  };
}

const AuthProtectedLayout = () => {
  const { data: session, isPending } = authClient.useSession();
  const segments = useSegments();
  const router = useRouter();

  const stringSegments = segments as string[];
  const firstSegment = stringSegments[0];

  // Derive whether the current route matches where the user should be.
  const isRouteReady = useMemo(() => {
    if (isPending) return false;

    if (!session) {
      // Not logged in — ready only if already on login or legal pages
      return firstSegment === "login" || firstSegment === "privacy" || firstSegment === "terms";
    }

    const onboardingIncomplete = !session.user.weight && !session.user.height;
    if (onboardingIncomplete) {
      return firstSegment === "onboarding";
    }

    // Logged in with complete profile — ready if on tabs or legal pages
    return firstSegment === "(tabs)" || firstSegment === "privacy" || firstSegment === "terms";
  }, [isPending, session, firstSegment]);

  useEffect(() => {
    if (isPending || isRouteReady) return;

    if (!session) {
      router.replace("/login");
    } else {
      const onboardingIncomplete = !session.user.weight && !session.user.height;
      if (onboardingIncomplete) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)/dashboard");
      }
    }
  }, [isPending, isRouteReady, session, router]);

  // Show spinner until auth resolves AND we're on the correct screen
  if (!isRouteReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-zinc-950">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="terms" />
    </Stack>
  );
};

const RootLayout = () => {
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <HeroUINativeProvider>
          <View
            className={
              isDark ? "dark flex-grow flex-1 bg-background" : "flex-grow flex-1 bg-background"
            }
          >
            <AuthProtectedLayout />
            <StatusBar style={isDark ? "light" : "dark"} />
          </View>
        </HeroUINativeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
