import { useMemo } from "react";
import { authClient } from "../app/lib/auth-client";
import useYourIntakeOperations from "./useYourIntakeOperations";
import useActivityOperations from "./useActivityOperations";
import {
  calculateRecommendedMacros,
  adjustMacrosWithBurnedCalories,
} from "../utils/FunctionsHelper";
import {
  ACTIVITY_MULTIPLIERS,
  GOAL_MULTIPLIERS,
  Food,
  macros,
  timeOfDay,
  TimeOfDay,
} from "../types/Types";

const useTodayMacros = () => {
  const { savedFood } = useYourIntakeOperations();
  const { savedActivities } = useActivityOperations();
  const { data } = authClient.useSession();
  const user = data?.user;

  const activityKey = (user?.activityLevel ||
    "lightlyActive") as keyof typeof ACTIVITY_MULTIPLIERS;
  const goalKey = (user?.goal ||
    "maintainWeight") as keyof typeof GOAL_MULTIPLIERS;

  const burnedCalories = useMemo(() => {
    return savedActivities
      ? savedActivities.reduce((sum, act) => sum + (act.caloriesBurned || 0), 0)
      : 0;
  }, [savedActivities]);

  const recommendedMacros = useMemo(() => {
    const baseline = user
      ? calculateRecommendedMacros(
          user.weight ? user.weight : 0,
          user.height ? user.height : 0,
          ACTIVITY_MULTIPLIERS[activityKey],
          GOAL_MULTIPLIERS[goalKey],
        )
      : {
          calories: 0,
          fat: 0,
          protein: 0,
          sugar: 0,
          carbohydrates: 0,
          fiber: 0,
          salt: 0,
        };

    return adjustMacrosWithBurnedCalories(baseline, burnedCalories);
  }, [user, activityKey, goalKey, burnedCalories]);

  const calculatedMacros = useMemo(() => {
    if (savedFood) {
      const savedMacros: macros = {
        calories: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        protein: 0,
        salt: 0,
        sugar: 0,
      };

      timeOfDay.forEach((value) => {
        const timeInDaySavedMacro = savedFood[
          value as TimeOfDay
        ].reduce(
          (acc: macros, item: Food) => {
            acc.calories += item.calories;
            acc.carbohydrates += item.carbohydrates;
            acc.fat += item.fat;
            acc.fiber += item.fiber;
            acc.protein += item.protein;
            acc.salt += item.salt;
            acc.sugar += item.sugar;
            return acc;
          },
          {
            calories: 0,
            carbohydrates: 0,
            fat: 0,
            fiber: 0,
            protein: 0,
            salt: 0,
            sugar: 0,
          },
        );

        Object.keys(savedMacros).forEach((key) => {
          const keyT = key as keyof macros;
          savedMacros[keyT] += timeInDaySavedMacro[keyT];
        });
      });

      Object.keys(savedMacros).forEach((key) => {
        const keyT = key as keyof macros;
        savedMacros[keyT] = Number(savedMacros[keyT].toFixed(2));
      });

      return savedMacros;
    }

    return {
      calories: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      protein: 0,
      salt: 0,
      sugar: 0,
    };
  }, [savedFood]);

  return {
    recommendedMacros,
    calculatedMacros,
    burnedCalories,
    user,
  };
};

export default useTodayMacros;
