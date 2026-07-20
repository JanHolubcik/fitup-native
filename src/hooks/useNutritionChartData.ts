import { useMemo } from "react";
import { format, parseISO, subDays, eachDayOfInterval, isAfter } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { Food, FoodType, timeOfDay, TimeOfDay } from "@/types/Types";
import useTodayMacros from "./useTodayMacros";
import { MacroType } from "@/utils/MacrosHelper";

export type DailyNutritionalData = {
  date: string;
  rawDate: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  sugar: number;
  fiber: number;
};

export type TableDataItem = {
  label: string;
  value: string | number;
  sub: string;
  subColor: string;
};

const useNutritionChartData = (maxDays: number = 6) => {
  const today = new Date();
  const dateTo = format(today, "yyyy-MM-dd");
  const dateFrom = format(subDays(today, 30), "yyyy-MM-dd");

  const { data: savedFoodMonth = {}, isLoading } = useQuery(
    LastMonthFoodOptions(dateFrom, dateTo)
  );
  const { recommendedMacros } = useTodayMacros();

  const dailyHistory: DailyNutritionalData[] = useMemo(() => {
    const datesWithFood = Object.keys(savedFoodMonth)
      .filter((dayKey) => {
        const dayFood = savedFoodMonth[dayKey];
        if (!dayFood) return false;
        return timeOfDay.some((meal) => (dayFood[meal]?.length || 0) > 0);
      })
      .sort();

    if (datesWithFood.length === 0) {
      return [];
    }

    const firstLoggedDate = parseISO(datesWithFood[0]);
    const lastLoggedDate = parseISO(datesWithFood[datesWithFood.length - 1]);

    const endDate = isAfter(lastLoggedDate, today) ? today : lastLoggedDate;

    const maxDaysBeforeEnd = subDays(endDate, maxDays - 1);
    const startDate = isAfter(firstLoggedDate, maxDaysBeforeEnd)
      ? firstLoggedDate
      : maxDaysBeforeEnd;

    const dateInterval = eachDayOfInterval({ start: startDate, end: endDate }).slice(-maxDays);

    return dateInterval.map((dateObj) => {
      const dateKey = format(dateObj, "yyyy-MM-dd");
      const dayLabel = format(dateObj, "d.M");

      const dayFood: FoodType | undefined = savedFoodMonth[dateKey];

      let calories = 0;
      let protein = 0;
      let carbohydrates = 0;
      let fat = 0;
      let sugar = 0;
      let fiber = 0;

      if (dayFood) {
        timeOfDay.forEach((mealKey: TimeOfDay) => {
          const items = dayFood[mealKey] || [];
          items.forEach((item: Food) => {
            calories += item.calories || 0;
            protein += item.protein || 0;
            carbohydrates += item.carbohydrates || 0;
            fat += item.fat || 0;
            sugar += item.sugar || 0;
            fiber += item.fiber || 0;
          });
        });
      }

      return {
        date: dayLabel,
        rawDate: dateKey,
        calories: Number(calories.toFixed(0)),
        protein: Number(protein.toFixed(1)),
        carbohydrates: Number(carbohydrates.toFixed(1)),
        fat: Number(fat.toFixed(1)),
        sugar: Number(sugar.toFixed(1)),
        fiber: Number(fiber.toFixed(1)),
      };
    });
  }, [savedFoodMonth, today, maxDays]);

  const emptyDays = useMemo(() => {
    return dailyHistory.filter((item) => item.calories === 0).length;
  }, [dailyHistory]);

  const getStatsForMacro = (selectedMacro: MacroType) => {
    const values = dailyHistory.map((item) => item[selectedMacro]);
    const recValue = recommendedMacros[selectedMacro] ?? 0;
    const unit = selectedMacro === "calories" ? "kcal" : "g";
    const hasValues = values.length > 0;

    const avg = hasValues
      ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))
      : 0;

    const peak = hasValues ? Number(Math.max(...values).toFixed(1)) : 0;

    const daysOver = hasValues
      ? values.filter((v) => recValue > 0 && v > recValue).length
      : 0;

    return {
      values,
      recValue,
      unit,
      avg,
      peak,
      daysOver,
      trackedDays: values.length,
    };
  };

  return {
    dailyHistory,
    isLoading,
    emptyDays,
    totalLoggedDays: dailyHistory.length,
    getStatsForMacro,
    recommendedMacros,
  };
};

export default useNutritionChartData;
