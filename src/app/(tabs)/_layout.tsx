import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { ColorValue, Image, View } from "react-native";
import { useUniwind } from "uniwind";
import { useTranslation } from "../../hooks/useTranslation";
import { authClient } from "../lib/auth-client";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const TabIcon = ({
  name,
  color,
  size = 28,
}: {
  name: IoniconName;
  color: ColorValue;
  size?: number;
}) => {
  return <Ionicons name={name} size={size} color={color} />;
};

const TabsLayout = () => {
  const { t } = useTranslation();
  const { data: session } = authClient.useSession();
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const user = session?.user;
  const userImage = user?.image;

  return (
    <Tabs
      key={theme}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#18181b" : "#ffffff",
          borderTopColor: isDark ? "#27272a" : "#e4e4e7",
        },
        tabBarActiveTintColor: "#006fee",
        tabBarInactiveTintColor: isDark ? "#71717a" : "#a1a1aa",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="add-record"
        options={{
          title: t("navbar.add"),
          tabBarIcon: ({ color }) => <TabIcon name="add-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t("navbar.dashboard"),
          tabBarIcon: ({ color }) => <TabIcon name="stats-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("navbar.profile"),
          tabBarIcon: ({ focused }) => {
            const displayImage =
              userImage ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            return (
              <View
                className={`w-8 h-8 rounded-full overflow-hidden border-2 ${
                  focused ? "border-blue-500" : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <Image source={{ uri: displayImage }} className="w-full h-full" />
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
