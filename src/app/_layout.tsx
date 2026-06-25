import { useEffect, type JSX } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, View } from "react-native";
import { authClient } from "./lib/auth-client";
import { useUniwind } from "uniwind";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";

import "../global.css";
import "../i18n/i18n";

function AuthProtectedLayout(): JSX.Element {
  const { data: session, isPending } = authClient.useSession();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (isPending) return;

    const inAuthGroup = segments[0] === "(tabs)";
    const inLogin = segments[0] === "login";

    if (!session && inAuthGroup) {
      // Redirect to the login screen if not authenticated
      router.replace("/login");
    } else if (session && inLogin) {
      // Redirect to dashboard if authenticated
      router.replace("/(tabs)/dashboard");
    }
  }, [session, isPending, segments, router]);

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" className="text-primary" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout(): JSX.Element {
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
}
