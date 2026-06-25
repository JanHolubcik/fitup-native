import { Tabs } from "expo-router";
import { Typography, useThemeColor } from "heroui-native";
import type { JSX } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import ThemeSwitcher from "../components/ThemeSwitcher";

export default function ProfileTab(): JSX.Element {
  const { t } = useTranslation();
  const themeColorPrimary = useThemeColor("accent");
  const themeColorForeground = useThemeColor("foreground");

  return (
    <>
      <Tabs.Screen options={{ title: t("navbar.profile") }} />
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
        <Typography.Paragraph>{t("navbar.profile")}</Typography.Paragraph>
        <View className="gap-4">
          <ThemeSwitcher />
        </View>
      </ScrollView>
    </>
  );
}
