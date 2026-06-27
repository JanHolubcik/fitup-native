import { QueryClient, focusManager, onlineManager } from "@tanstack/react-query";
import { AppState, Platform, type AppStateStatus } from "react-native";
import * as Network from "expo-network";
import React from "react";
import { useFocusEffect } from "expo-router";

// Create QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

// Configure App Focus Refetch
focusManager.setEventListener((handleFocus) => {
  if (Platform.OS !== "web") {
    const subscription = AppState.addEventListener("change", (status: AppStateStatus) => {
      if (status === "active") {
        handleFocus();
      }
    });

    return () => subscription.remove();
  }
});

// Configure Online Status Management
onlineManager.setEventListener((setOnline) => {
  // Set initial online status asynchronously
  Network.getNetworkStateAsync()
    .then((state) => {
      setOnline(!!state.isConnected);
    })
    .catch((err) => {
      console.error("Failed to get initial network state:", err);
    });

  const subscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });

  return () => {
    subscription.remove();
  };
});

/**
 * A custom hook to refetch a query when the React Navigation / Expo Router screen comes into focus.
 * 
 * @param refetch The refetch function returned from useQuery.
 */
export const useRefreshOnScreenFocus = <T>(refetch: () => Promise<T>) => {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch().catch((err) => {
        console.error("Error refetching query on focus:", err);
      });
    }, [refetch])
  );
};
