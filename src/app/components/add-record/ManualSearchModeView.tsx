import React from "react";
import { View, TextInput, FlatList, ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography, Skeleton } from "heroui-native";
import { FoodClass } from "@/types/Types";
import { MACRO_TAILWIND_THEME, MacroType } from "@/utils/MacrosHelper";
import ImageFromURL from "../common/ImageFromURL";
import CardError from "../common/CardError";

type ManualSearchModeViewProps = {
  onSelectModeChange: (mode: "select" | "manual" | "scanner" | "ai") => void;
  t: (key: string) => string;
  isDark: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showSkeleton: boolean;
  handleClear: () => void;
  foodOptions: FoodClass[] | undefined;
  error: Error | null;
  refetch: () => void;
  debouncedSearchTerm: string;
  handleFoodSelect: (foodItem: FoodClass & { originalName?: string }, index: number) => void;
  getMacroLabel: (key: Exclude<MacroType, "calories">) => string;
};

const ManualSearchModeView = ({
  onSelectModeChange,
  t,
  isDark,
  searchTerm,
  setSearchTerm,
  showSkeleton,
  handleClear,
  foodOptions,
  error,
  refetch,
  debouncedSearchTerm,
  handleFoodSelect,
  getMacroLabel,
}: ManualSearchModeViewProps) => {
  return (
    <View className="flex-1 gap-4">
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => onSelectModeChange("select")}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl items-center justify-center active:bg-zinc-50 dark:active:bg-zinc-800"
          style={{ borderCurve: "continuous" }}
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? "#ffffff" : "#000000"} />
        </Pressable>
        <View className="flex-col">
          <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
            {t("tour.manualSearch.title")}
          </Typography.Heading>
        </View>
      </View>

      <View
        className="flex-row items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 h-12"
        style={{ borderCurve: "continuous" }}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color={isDark ? "#52525b" : "#a1a1aa"}
          style={{ marginRight: 8 }}
        />
        <TextInput
          className="flex-1 text-zinc-900 dark:text-white text-sm h-full py-0"
          style={{ paddingVertical: 0 }}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder={t("searchPlaceholder")}
          placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
          autoFocus
        />
        {showSkeleton ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : searchTerm.length > 0 ? (
          <Pressable onPress={handleClear} className="active:opacity-75">
            <Ionicons name="close-circle" size={18} color={isDark ? "#52525b" : "#a1a1aa"} />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={showSkeleton ? Array.from({ length: 3 }) : (foodOptions || [])}
        keyExtractor={(item, index) => {
          if (showSkeleton) return `skeleton-${index}`;
          return (item as FoodClass).id || (item as FoodClass)._id || `food-${index}`;
        }}
        contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
        renderItem={({ item, index }) => {
          if (showSkeleton) {
            return (
              <View
                key={`skeleton-${index}`}
                className="border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 p-3 rounded-2xl flex-row gap-3 items-center"
              >
                <Skeleton className="w-16 h-16 rounded-xl bg-default-soft dark:bg-zinc-800" />
                <View className="flex-1 gap-1.5">
                  <Skeleton className="h-4 w-3/4 rounded-md bg-default-soft dark:bg-zinc-800" />
                  <Skeleton className="h-3 w-1/2 rounded-md bg-default-soft dark:bg-zinc-800" />
                  <View className="flex-row gap-1 mt-0.5">
                    <Skeleton className="h-4 w-8 rounded-full bg-default-soft dark:bg-zinc-800" />
                    <Skeleton className="h-4 w-8 rounded-full bg-default-soft dark:bg-zinc-800" />
                    <Skeleton className="h-4 w-8 rounded-full bg-default-soft dark:bg-zinc-800" />
                  </View>
                </View>
              </View>
            );
          }

          const foodItem = item as FoodClass & { originalName?: string };
          return (
            <Pressable
              key={foodItem.id || foodItem._id || `food-${index}`}
              onPress={() => handleFoodSelect(foodItem, index)}
              className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 active:bg-zinc-50 dark:active:bg-zinc-800 p-3 rounded-2xl flex-row gap-3 items-center"
              style={{ borderCurve: "continuous" }}
            >
              <ImageFromURL
                url={foodItem.imgUrl}
                macroName={foodItem.originalName || foodItem.name}
                width={64}
                height={64}
              />
              <View className="flex-1 gap-1">
                <Typography.Heading
                  type="h4"
                  className="text-sm font-bold text-zinc-950 dark:text-white leading-4"
                  numberOfLines={1}
                >
                  {foodItem.name}
                </Typography.Heading>
                <Typography.Paragraph className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold">
                  {foodItem.calories_per_100g} {t("todayMacros.kcal")} / 100g
                </Typography.Paragraph>

                <View className="flex-row gap-1 flex-wrap mt-0.5">
                  {(
                    [
                      { key: "protein", value: foodItem.protein },
                      { key: "carbohydrates", value: foodItem.carbohydrates },
                      { key: "fat", value: foodItem.fat },
                    ] as const
                  ).map(({ key, value }) => {
                    const macroTheme = MACRO_TAILWIND_THEME[key];
                    return (
                      <View
                        key={key}
                        className={`px-1.5 py-0.5 rounded-md border ${macroTheme.bg} ${macroTheme.border}`}
                        style={{ borderCurve: "continuous" }}
                      >
                        <Typography.Paragraph
                          className={`text-[8px] font-bold ${macroTheme.text} uppercase`}
                        >
                          {getMacroLabel(key)}: {value}g
                        </Typography.Paragraph>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={() => {
          if (error) {
            return (
              <CardError
                title={t("error.failedToLoad")}
                description={t("error.failedToLoadDesc")}
                icon={<Ionicons name="alert-circle" size={32} color="#ef4444" />}
                refetch={refetch}
              />
            );
          }

          if (debouncedSearchTerm.trim().length > 0 && foodOptions?.length === 0) {
            return (
              <View className="p-6 items-center gap-4">
                <View className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center">
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color={isDark ? "#a1a1aa" : "#71717a"}
                  />
                </View>
                <Typography.Paragraph className="text-zinc-500 dark:text-zinc-400 text-xs text-center px-4 leading-4">
                  {t("recordNotFound")}
                </Typography.Paragraph>
              </View>
            );
          }

          return (
            <View className="py-8 items-center gap-3">
              <View className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-full items-center justify-center">
                <Ionicons name="flame-outline" size={24} color="#3b82f6" />
              </View>
              <Typography.Paragraph className="text-zinc-500 dark:text-zinc-400 text-xs text-center px-6 leading-4 font-semibold">
                {t("tour.manualSearch.description")}
              </Typography.Paragraph>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ManualSearchModeView;
