import { useState } from "react";
import { Platform } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "@/hooks/useTranslation";
import { useDebounce } from "@/utils/FunctionsHelper";
import { useUniwind } from "uniwind";
import { getSearchedFoodOptions } from "@/app/lib/queriesOptions/GetSearchedFoodOptions";
import { Food, FoodClass } from "@/types/Types";
import { MacroType } from "@/utils/MacrosHelper";
import { useActiveTimeFrame } from "@/hooks/useDashboardState";
import useScanProduct from "@/hooks/useScanProduct";

type SearchMode = "select" | "manual" | "scanner" | "ai";

const useAddRecord = () => {
  const { t, locale } = useTranslation("dashboard");
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const [activeTimeFrame] = useActiveTimeFrame();
  const { mode } = useLocalSearchParams<{ mode?: string }>();

  const [prevMode, setPrevMode] = useState<string | undefined>(mode);
  const [searchMode, setSearchMode] = useState<SearchMode>(() => {
    if (mode === "scanner" || mode === "manual" || mode === "select") {
      return mode;
    }
    return "select";
  });

  if (mode !== prevMode) {
    setPrevMode(mode);
    if (mode === "scanner" || mode === "manual" || mode === "select") {
      setSearchMode(mode);
    } else {
      setSearchMode("select");
    }
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isNotFoundOpen, setIsNotFoundOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500, setIsTyping);

  const {
    data: foodOptions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: getSearchedFoodOptions(debouncedSearchTerm, locale).queryKey,
    queryFn: getSearchedFoodOptions(debouncedSearchTerm, locale).mutationFn,
    enabled: searchMode === "manual" && debouncedSearchTerm.trim().length > 0,
  });

  const { mutate: scanProduct, isPending: isScanningProduct } = useScanProduct(() => {
    setIsNotFoundOpen(true);
  });

  const showSkeleton = isLoading || isTyping;
  const paddingTop = Platform.OS === "ios" ? 60 : 40;

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

  const handleScan = (barcode: string) => {
    scanProduct(barcode, {
      onSuccess: (data) => {
        if (data && !data.notFound) {
          const weight = data.ProductWeight || 100;
          const multiplier = weight / 100;

          const parsedFood: Food = {
            ...data,
            id: Date.now(),
            amount: `${weight}`,
            calories: Math.round(data.calories_per_100g * multiplier),
            fat: Number(data.fat * multiplier),
            protein: Number(data.protein * multiplier),
            sugar: Number(data.sugar * multiplier),
            carbohydrates: Number(data.carbohydrates * multiplier),
            fiber: Number(data.fiber * multiplier),
            salt: Number(data.salt * multiplier),
            originalName: data.originalName || data.name,
          };
          setSelectedFood(parsedFood);
          setIsRecordModalOpen(true);
        }
      },
    });
  };

  const handleNotFoundYes = () => {
    setIsNotFoundOpen(false);
    setSearchMode("manual");
  };

  return {
    t,
    isDark,
    searchMode,
    setSearchMode,
    searchTerm,
    setSearchTerm,
    selectedFood,
    setSelectedFood,
    isRecordModalOpen,
    setIsRecordModalOpen,
    isNotFoundOpen,
    setIsNotFoundOpen,
    foodOptions,
    debouncedSearchTerm,
    isScanningProduct,
    showSkeleton,
    paddingTop,
    handleClear,
    handleFoodSelect,
    getMacroLabel,
    handleScan,
    handleNotFoundYes,
    activeTimeFrame,
    error,
    refetch,
  };
};

export default useAddRecord;
