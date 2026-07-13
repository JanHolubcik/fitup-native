import { Tabs } from "expo-router";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";

import { useTranslation } from "../../hooks/useTranslation";
import ProfileMainComponent from "../components/profile/ProfileMainComponent";
import useSwipeNavigation from "@/hooks/useSwipeNavigation";

const ProfileTab = () => {
  const { t } = useTranslation("navbar");
  const swipeGesture = useSwipeNavigation({
    rightTarget: "/(tabs)/dashboard",
  });

  return (
    <>
      <Tabs.Screen options={{ title: t("profile") }} />
      <GestureDetector gesture={swipeGesture}>
        <View className="flex-grow flex-1 bg-zinc-50 dark:bg-zinc-950">
          <ProfileMainComponent />
        </View>
      </GestureDetector>
    </>
  );
};

export default ProfileTab;
