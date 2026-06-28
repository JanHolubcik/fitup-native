import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const TabIcon = ({ name, color }: { name: IoniconName; color: ColorValue }) => {
  return <Ionicons name={name} size={24} color={color} />;
};

const TabsLayout = () => {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t("navbar.dashboard"),
          tabBarIcon: ({ color }) => <TabIcon name="stats-chart-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("navbar.profile"),
          tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
