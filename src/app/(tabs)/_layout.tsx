import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps, JSX } from "react";
import type { ColorValue } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, color }: { name: IoniconName; color: ColorValue }): JSX.Element {
  return <Ionicons name={name} size={24} color={color} />;
}

export default function TabsLayout(): JSX.Element {
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
          title: "Dashboard",
          tabBarIcon: ({ color }) => <TabIcon name="stats-chart-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
