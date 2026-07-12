import React, { useState } from "react";
import { View, TextInput, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { Dialog, Typography, Button, Skeleton } from "heroui-native";

import { useTranslation } from "@/hooks/useTranslation";
import { useDebounce } from "@/utils/FunctionsHelper";
import { useUniwind } from "uniwind";
import { getSearchedFoodOptions } from "@/app/lib/queriesOptions/GetSearchedFoodOptions";
import { Food, FoodClass, TimeOfDay } from "@/types/Types";
import { MACRO_TAILWIND_THEME, MacroType } from "@/utils/MacrosHelper";
import ImageFromURL from "../common/ImageFromURL";
import CardError from "../common/CardError";
import FoodRecordModal from "./FoodRecordModal";

type ModalFindFoodProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  timeOfDay?: TimeOfDay;
};

const ModalFindFood = ({ isOpen, onOpenChange, timeOfDay = "breakfast" }: ModalFindFoodProps) => {
  const { t, locale } = useTranslation("dashboard");
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500, setIsTyping);

  const {
    data: foodOptions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: getSearchedFoodOptions(debouncedSearchTerm, locale).queryKey,
    queryFn: getSearchedFoodOptions(debouncedSearchTerm, locale).mutationFn,
    enabled: isOpen && debouncedSearchTerm.trim().length > 0,
  });

  const showSkeleton = isLoading || isTyping;

  const handleClear = () => {
    setSearchTerm("");
  };

  const handleFoodSelect = (foodItem: FoodClass & { originalName?: string }, index: number) => {
    const mappedFood: Food = {
      ...foodItem,
      id: index,
      originalName: foodItem.originalName || foodItem.name,
      calories: foodItem.calories_per_100g,
      amount: "100",
    };
    setSelectedFood(mappedFood);
    setIsRecordModalOpen(true);
  };

  const getMacroLabel = (key: Exclude<MacroType, "calories">) => {
    switch (key) {
      case "protein":
        return t("addFood.proteinShort");
      case "carbohydrates":
        return t("addFood.carbsShort");
      case "fat":
        return t("addFood.fatShort");
      case "sugar":
        return t("addFood.sugarShort");
      case "fiber":
        return t("addFood.fiber");
      default:
        return "";
    }
  };

  return (
    <>
      <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50" />
          <Dialog.Content
            className={`w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl gap-4 ${isDark ? "dark" : ""}`}
            style={{ height: "80%" }}
            isSwipeable={false}
          >
            <View className="flex-col gap-1 items-start">
              <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
                {t("tour.manualSearch.title")}
              </Typography.Heading>
              <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400">
                {t("tour.manualSearch.description")}
              </Typography.Paragraph>
            </View>

            <View
              className="flex-row items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 h-12"
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
              />
              {showSkeleton ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : searchTerm.length > 0 ? (
                <Pressable onPress={handleClear} className="active:opacity-75">
                  <Ionicons name="close-circle" size={18} color={isDark ? "#52525b" : "#a1a1aa"} />
                </Pressable>
              ) : null}
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ gap: 10, paddingBottom: 12 }}>
              {showSkeleton ? (
                Array.from({ length: 3 }).map((_, index) => (
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
                ))
              ) : error ? (
                <CardError
                  title={t("error.failedToLoad")}
                  description={t("error.failedToLoadDesc")}
                  icon={<Ionicons name="alert-circle" size={32} color="#ef4444" />}
                  refetch={() => {
                    refetch();
                  }}
                />
              ) : debouncedSearchTerm.trim().length > 0 && foodOptions?.length === 0 ? (
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
              ) : foodOptions && foodOptions.length > 0 ? (
                foodOptions.map((foodItem, index) => (
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
                ))
              ) : (
                <View className="py-8 items-center gap-3">
                  <View className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-full items-center justify-center">
                    <Ionicons name="flame-outline" size={24} color="#3b82f6" />
                  </View>
                  <Typography.Paragraph className="text-zinc-500 dark:text-zinc-400 text-xs text-center px-6 leading-4 font-semibold">
                    {t("tour.manualSearch.description")}
                  </Typography.Paragraph>
                </View>
              )}
            </ScrollView>

            <View className="flex-row justify-end mt-2">
              <Button
                variant="outline"
                className="py-2 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 h-10 justify-center items-center bg-red-500/10 border-red-500/20"
                onPress={() => onOpenChange(false)}
              >
                <Button.Label className="text-red-500 text-sm font-semibold">
                  {t("close")}
                </Button.Label>
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <FoodRecordModal
        key={selectedFood ? `new-${selectedFood.id}-${timeOfDay}` : "new-none"}
        isOpen={isRecordModalOpen}
        onOpenChange={setIsRecordModalOpen}
        food={selectedFood}
        timeOfDay={timeOfDay}
        mode="new"
        onCloseAll={() => onOpenChange(false)}
      />
    </>
  );
};

export default ModalFindFood;
