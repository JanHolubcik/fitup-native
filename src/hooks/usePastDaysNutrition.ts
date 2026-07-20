import { useMemo } from "react";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import { LastMonthFoodOptions } from "@/lib/queriesOptions/LastMonthFoodOptions";
import { Food, FoodType, timeOfDay, TimeOfDay } from "@/types/Types";

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

const usePastDaysNutrition = (daysCount: number = 10) => {
  const today = new Date();
  const dateTo = format(today, "yyyy-MM-dd");
  const dateFrom = format(subDays(today, 30), "yyyy-MM-dd");

  const { data: savedFoodMonth = {}, isLoading } = useQuery(
    LastMonthFoodOptions(dateFrom, dateTo)
  );

  const dailyHistory = useMemo(() => {
    const startDate = subDays(today, daysCount - 1);
    const dateInterval = eachDayOfInterval({ start: startDate, end: today });

    return dateInterval.map((dateObj) => {
      const dateKey = format(dateObj, "yyyy-MM-dd");
      const dayLabel = format(dateObj, "MMM dd");

      const dayFood: FoodType = savedFoodMonth[dateKey] ?? {
        breakfast: [],
        lunch: [],
        dinner: [],
      };

      let calories = 0;
      let protein = 0;
      let carbohydrates = 0;
      let fat = 0;
      let sugar = 0;
      let fiber = 0;

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
  }, [savedFoodMonth, today, daysCount]);

  return {
    dailyHistory,
    isLoading,
  };
};

export default usePastDaysNutrition;
