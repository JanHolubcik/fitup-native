import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Button, Card, Typography, useThemeColor } from "heroui-native";
import type { JSX } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";

export default function DashboardTab(): JSX.Element {
  const { t } = useTranslation();
  const themeColorPrimary = useThemeColor("accent");
  const themeColorForeground = useThemeColor("foreground");

  return (
    <>
      <Tabs.Screen options={{ title: t("navbar.dashboard") }} />
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
        <Typography.Paragraph>{t("navbar.dashboard")}</Typography.Paragraph>
      </ScrollView>
    </>
  );
}
