import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Typography } from "heroui-native";
import { useUniwind } from "uniwind";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import useActivityOperations from "@/hooks/useActivityOperations";
import useCalculateRecommendedCalories from "@/hooks/useCalculateRecommendedCalories";
import { useTranslation } from "@/hooks/useTranslation";
import CardUniversal from "../common/CardUniversal";

const CalorieCard = () => {
  const { savedFood } = useYourIntakeOperations();
  const { savedActivities } = useActivityOperations();
  const { recommendedCaloriesValue, caloriesSum } = useCalculateRecommendedCalories(
    savedFood,
    savedActivities
  );
  const { t } = useTranslation("dashboard");
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const color = caloriesSum > recommendedCaloriesValue ? "danger" : "success";
  const diff = Math.abs(recommendedCaloriesValue - caloriesSum).toFixed(0);

  let label = t("calorieCard.kcalRemaining", { amount: diff });
  if (caloriesSum === 0) {
    label = t("calorieCard.noRecords");
  } else if (caloriesSum > recommendedCaloriesValue) {
    label = t("calorieCard.kcalOver", { amount: diff });
  }

  // Circular Progress Dimensions
  const size = 170;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate percentage and stroke offset
  const maxVal = recommendedCaloriesValue > 0 ? recommendedCaloriesValue : 2000;
  const percentage = maxVal > 0 ? Math.min(caloriesSum / maxVal, 1) : 0;
  const targetOffset = circumference - percentage * circumference;

  const animatedOffset = useSharedValue(targetOffset);

  useEffect(() => {
    animatedOffset.value = withTiming(targetOffset, { duration: 500 });
  }, [targetOffset, animatedOffset]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  let strokeColor = "#22c55e"; // success (green-500)
  if (color === "danger") {
    strokeColor = "#ef4444"; // danger (red-500)
  }

  return (
    <CardUniversal className="w-full border-zinc-200 dark:border-zinc-800 shadow-md">
      <CardUniversal.Body className="p-6 items-center justify-center w-full">
        <View
          className="items-center justify-center relative"
          style={{ width: size, height: size }}
        >
          <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isDark ? "#27272a" : "#e4e4e7"}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Foreground Circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              animatedProps={animatedCircleProps}
              strokeLinecap="round"
            />
          </Svg>

          <View className="absolute items-center justify-center w-full h-full">
            <Typography.Heading
              type="h3"
              className="text-zinc-950 dark:text-white font-extrabold text-3xl"
            >
              {Math.round(percentage * 100)}%
            </Typography.Heading>
          </View>
        </View>

        <Typography.Paragraph className="text-zinc-900 dark:text-white text-lg font-extrabold text-center mt-4">
          {label}
        </Typography.Paragraph>
      </CardUniversal.Body>
    </CardUniversal>
  );
};

export default CalorieCard;
