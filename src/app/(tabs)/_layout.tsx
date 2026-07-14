import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { ColorValue, Image, View } from "react-native";
import { useUniwind } from "uniwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "../../hooks/useTranslation";
import { authClient } from "../lib/auth-client";
import MaterialTopTabs from "../components/common/MaterialTopTabs";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const TabIcon = ({
  name,
  color,
  size = 24,
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
  const insets = useSafeAreaInsets();

  return (
    <MaterialTopTabs
      key={theme}
      tabBarPosition="bottom"
      screenOptions={{
        tabBarShowIcon: true,
        tabBarActiveTintColor: "#006fee",
        tabBarInactiveTintColor: isDark ? "#71717a" : "#a1a1aa",
        tabBarIndicatorStyle: {
          height: 0,
        },
        tabBarStyle: {
          backgroundColor: isDark ? "#18181b" : "#ffffff",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#27272a" : "#e4e4e7",
          paddingBottom: insets.bottom,
          height: 52 + insets.bottom,
          shadowOpacity: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          textTransform: "none",
          margin: 0,
          padding: 0,
        },
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          tabBarItemStyle: { display: "none" },
        }}
      />
      <MaterialTopTabs.Screen
        name="add-record"
        options={{
          title: t("navbar.add"),
          tabBarIcon: ({ color }) => <TabIcon name="add-circle" color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="dashboard"
        options={{
          title: t("navbar.dashboard"),
          tabBarIcon: ({ color }) => <TabIcon name="stats-chart" color={color} />,
        }}
      />
      <MaterialTopTabs.Screen
        name="profile"
        options={{
          title: t("navbar.profile"),
          tabBarIcon: ({ focused }) => {
            const displayImage =
              userImage ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            return (
              <View
                className={`w-7 h-7 rounded-full overflow-hidden border-2 ${
                  focused ? "border-blue-500" : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                <Image source={{ uri: displayImage }} className="w-full h-full" />
              </View>
            );
          },
        }}
      />
    </MaterialTopTabs>
  );
};

export default TabsLayout;
