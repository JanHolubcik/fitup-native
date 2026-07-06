import React from "react";
import { View, ScrollView, Pressable, Platform } from "react-native";
import { Typography } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useUniwind } from "uniwind";
import { useTranslation as useReactI18nextTranslation } from "react-i18next";

type PolicySection = {
  title: string;
  items: string[];
};

const PrivacyScreen = () => {
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const { t } = useReactI18nextTranslation("privacy");
  const sections = t("sections", { returnObjects: true }) as PolicySection[];

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950">
      <View
        className="flex-row items-center border-b border-zinc-200 dark:border-zinc-800 px-4 pb-4 bg-white dark:bg-zinc-950"
        style={{
          paddingTop: Platform.OS === "ios" ? 60 : 40,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center p-2 rounded-xl active:bg-zinc-100 dark:active:bg-zinc-800"
        >
          <Ionicons name="chevron-back" size={24} color={isDark ? "#ffffff" : "#18181b"} />
          <Typography.Paragraph className="text-zinc-900 dark:text-white font-medium ml-1">
            {t("backBtn")}
          </Typography.Paragraph>
        </Pressable>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingVertical: 24,
        }}
      >
        <View className="max-w-md mx-auto w-full gap-6">
          <View>
            <Typography.Heading
              type="h1"
              className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight"
            >
              {t("title")}
            </Typography.Heading>
            <Typography.Paragraph className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              {t("lastUpdated")}
            </Typography.Paragraph>
          </View>

          <Typography.Paragraph className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {t("intro")}
          </Typography.Paragraph>

          <View className="gap-6">
            {sections.map((section, idx) => (
              <View key={idx} className="gap-2.5">
                <Typography.Heading
                  type="h4"
                  className="font-bold text-zinc-900 dark:text-white text-lg"
                >
                  {section.title}
                </Typography.Heading>
                <View className="gap-2">
                  {section.items.map((item, itemIdx) => (
                    <View key={itemIdx} className="flex-row items-start pl-2 pr-4">
                      <Typography.Paragraph className="text-zinc-400 dark:text-zinc-500 mr-2">
                        •
                      </Typography.Paragraph>
                      <Typography.Paragraph className="flex-1 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {item}
                      </Typography.Paragraph>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyScreen;
