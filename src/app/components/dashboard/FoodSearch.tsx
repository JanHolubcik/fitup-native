import React, { useState } from "react";
import { View, TextInput, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { Typography, Card, Button, Skeleton } from "heroui-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useDebounce } from "@/utils/FunctionsHelper";
import { useUniwind } from "uniwind";
import { getSearchedFoodOptions } from "@/app/lib/queriesOptions/GetSearchedFoodOptions";
import CardUniversal from "../common/CardUniversal";
import { MACRO_TAILWIND_THEME, MacroType } from "@/utils/MacrosHelper";
import ImageFromURL from "../common/ImageFromURL";
import CardError from "../common/CardError";

const FoodSearch = () => {
  const { t, locale } = useTranslation("dashboard");
  const { theme } = useUniwind();
  const isDark = theme === "dark";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500, setIsTyping);

  const {
    data: foodOptions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: getSearchedFoodOptions(debouncedSearchTerm, locale).queryKey,
    queryFn: getSearchedFoodOptions(debouncedSearchTerm, locale).mutationFn,
    enabled: debouncedSearchTerm.trim().length > 0,
  });
  React.useEffect(() => {
    if (error) {
      console.error("[FoodSearch] TanStack Query error:", error);
    }
  }, [error]);
  const showSkeleton = isLoading || isTyping;

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <View className="flex-1 w-full gap-4">
      {/* Search Input Box */}
      <View
        className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl px-4 h-14 ${
          inputFocused
            ? "border-blue-500 dark:border-blue-500 bg-white dark:bg-zinc-900"
            : "border-zinc-200 dark:border-zinc-800"
        }`}
        style={{
          borderCurve: "continuous",
          boxShadow: inputFocused ? "0 4px 12px rgba(59, 130, 246, 0.08)" : undefined,
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={inputFocused ? "#3b82f6" : isDark ? "#52525b" : "#a1a1aa"}
          style={{ marginRight: 10 }}
        />
        <TextInput
          className="flex-1 text-zinc-900 dark:text-white text-base h-full py-0"
          style={{ paddingVertical: 0 }}
          value={searchTerm}
          onChangeText={setSearchTerm}
          onBlur={() => setInputFocused(false)}
          onFocus={() => setInputFocused(true)}
          placeholder={t("searchPlaceholder")}
          placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
        />
        {showSkeleton ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : searchTerm.length > 0 ? (
          <Pressable onPress={handleClear} className="active:opacity-75">
            <Ionicons name="close-circle" size={20} color={isDark ? "#52525b" : "#a1a1aa"} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {showSkeleton ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl"
            >
              <Card.Body className="p-4 flex-row gap-4 items-center">
                {/* Image Placeholder Skeleton */}
                <Skeleton className="w-24 h-24 rounded-xl bg-default-soft" />
                {/* Details Skeleton */}
                <View className="flex-1 gap-2">
                  <Skeleton className="h-5 w-3/4 rounded-md bg-default-soft" />
                  <Skeleton className="h-4 w-1/2 rounded-md bg-default-soft" />
                  <View className="flex-row gap-2 mt-1">
                    <Skeleton className="h-6 w-12 rounded-full bg-default-soft" />
                    <Skeleton className="h-6 w-12 rounded-full bg-default-soft" />
                    <Skeleton className="h-6 w-12 rounded-full bg-default-soft" />
                  </View>
                </View>
              </Card.Body>
            </Card>
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
          <CardUniversal className="rounded-2xl">
            <CardUniversal.Body className="p-6 items-center gap-4">
              <View className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full items-center justify-center">
                <Ionicons name="search-outline" size={28} color={isDark ? "#a1a1aa" : "#71717a"} />
              </View>
              <Typography.Paragraph className="text-zinc-600 dark:text-zinc-400 text-sm text-center px-4 leading-5">
                {t("recordNotFound")}
              </Typography.Paragraph>
              <Button className="bg-blue-600 dark:bg-blue-500 py-2.5 px-6 rounded-xl h-11 justify-center items-center shadow-md active:opacity-90">
                <Button.Label className="text-white font-bold text-sm">
                  {t("addManually")}
                </Button.Label>
              </Button>
            </CardUniversal.Body>
          </CardUniversal>
        ) : foodOptions && foodOptions.length > 0 ? (
          // Food List Results
          foodOptions.map((food, index) => {
            return (
              <Card
                key={food.id || food._id || `food-${index}`}
                className="border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-900"
                style={{ borderCurve: "continuous" }}
              >
                <Card.Body className="p-4 flex-row gap-4 items-center">
                  <ImageFromURL
                    url={food.imgUrl}
                    macroName={food.originalName ? food.originalName : food.name}
                    width={96}
                    height={96}
                  />

                  {/* Food Details */}
                  <View className="flex-1 justify-center gap-1.5">
                    <Typography.Heading
                      type="h4"
                      className="text-base font-bold text-zinc-950 dark:text-white leading-5"
                      numberOfLines={1}
                    >
                      {food.name}
                    </Typography.Heading>

                    <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400">
                      {food.calories_per_100g} {t("todayMacros.kcal")} / 100g
                    </Typography.Paragraph>

                    {/* Macronutrient badges */}
                    <View className="flex-row gap-2 flex-wrap mt-0.5">
                      {(
                        [
                          { key: "protein", value: food.protein },
                          { key: "carbohydrates", value: food.carbohydrates },
                          { key: "fat", value: food.fat },
                          { key: "sugar", value: food.sugar },
                          { key: "fiber", value: food.fiber },
                        ] as const
                      ).map(({ key, value }) => {
                        const macroTheme = MACRO_TAILWIND_THEME[key];
                        return (
                          <View
                            key={key}
                            className={`px-2.5 py-1 rounded-full border ${macroTheme.bg} ${macroTheme.border}`}
                            style={{ borderCurve: "continuous" }}
                          >
                            <Typography.Paragraph
                              className={`text-[10px] font-bold ${macroTheme.text} uppercase tracking-wide`}
                            >
                              {getMacroLabel(key)}: {value}g
                            </Typography.Paragraph>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </Card.Body>
              </Card>
            );
          })
        ) : (
          // Default Idle Search Instruction View
          <View className="py-12 items-center gap-3">
            <View className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 rounded-full items-center justify-center">
              <Ionicons name="flame-outline" size={30} color="#3b82f6" />
            </View>
            <Typography.Heading type="h4" className="text-zinc-900 dark:text-white font-bold mt-2">
              {t("tour.manualSearch.title")}
            </Typography.Heading>
            <Typography.Paragraph className="text-zinc-500 dark:text-zinc-400 text-sm text-center px-8 leading-5">
              {t("tour.manualSearch.description")}
            </Typography.Paragraph>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FoodSearch;
