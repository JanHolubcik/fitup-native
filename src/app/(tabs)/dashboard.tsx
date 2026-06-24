import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Typography, useThemeColor } from "heroui-native";
import type { JSX } from "react";
import { ScrollView, View } from "react-native";

export default function DashboardTab(): JSX.Element {
  const themeColorPrimary = useThemeColor("accent");
  const themeColorForeground = useThemeColor("foreground");

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
      <Typography.Paragraph>Dashboard</Typography.Paragraph>
    </ScrollView>
  );
}
