import React from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "heroui-native";

type SelectModeViewProps = {
  onSelectModeChange: (mode: "select" | "manual" | "scanner" | "ai") => void;
  t: (key: string) => string;
};

const SelectModeView = ({ onSelectModeChange, t }: SelectModeViewProps) => {
  return (
    <View className="flex-1 justify-center gap-6 px-2">
      <View className="flex-col gap-1 items-start">
        <Typography.Heading type="h2" className="font-bold text-zinc-900 dark:text-white">
          {t("tour.yourMeals.title")}
        </Typography.Heading>
        <Typography.Paragraph className="text-sm text-zinc-500 dark:text-zinc-400">
          {t("tour.yourMeals.description")}
        </Typography.Paragraph>
      </View>

      <View className="flex-col gap-4">
        <Pressable
          onPress={() => onSelectModeChange("manual")}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl flex-row items-center gap-4 active:bg-zinc-50 dark:active:bg-zinc-800"
          style={{ borderCurve: "continuous" }}
        >
          <View className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-2xl items-center justify-center">
            <Ionicons name="search-outline" size={24} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Typography.Heading type="h4" className="font-bold text-zinc-900 dark:text-white">
              {t("tour.manualSearch.title")}
            </Typography.Heading>
            <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {t("tour.manualSearch.description")}
            </Typography.Paragraph>
          </View>
        </Pressable>

        <Pressable
          onPress={() => onSelectModeChange("scanner")}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl flex-row items-center gap-4 active:bg-zinc-50 dark:active:bg-zinc-800"
          style={{ borderCurve: "continuous" }}
        >
          <View className="w-12 h-12 bg-green-50 dark:bg-green-950/30 rounded-2xl items-center justify-center">
            <Ionicons name="barcode-outline" size={24} color="#22c55e" />
          </View>
          <View className="flex-1">
            <Typography.Heading type="h4" className="font-bold text-zinc-900 dark:text-white">
              {t("modalBarcodeScan.title")}
            </Typography.Heading>
            <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {t("modalBarcodeScan.subtitle")}
            </Typography.Paragraph>
          </View>
        </Pressable>

        <Pressable
          onPress={() => onSelectModeChange("ai")}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl flex-row items-center gap-4 active:bg-zinc-50 dark:active:bg-zinc-800"
          style={{ borderCurve: "continuous" }}
        >
          <View className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-2xl items-center justify-center">
            <Ionicons name="sparkles-outline" size={24} color="#a855f7" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Typography.Heading type="h4" className="font-bold text-zinc-900 dark:text-white">
                {t("modalScanFood.useAIBtn")}
              </Typography.Heading>
              <View className="bg-purple-500/20 px-1.5 py-0.5 rounded-md">
                <Typography.Paragraph className="text-[8px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                  Gemini
                </Typography.Paragraph>
              </View>
            </View>
            <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {t("modalScanFood.subtitle")}
            </Typography.Paragraph>
          </View>
        </Pressable>

      </View>
    </View>
  );
};

export default SelectModeView;
