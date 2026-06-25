import { useEffect, type JSX } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator, View } from "react-native";
import { authClient } from "./lib/auth-client";

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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <AuthProtectedLayout />
        <StatusBar style="auto" />
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
