import React, { useEffect } from "react";
import { View } from "react-native";
import { Typography } from "heroui-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type MacrosProgressBarDashboardProps = {
  label: string;
  current: number;
  target: number;
  unit?: string;
  colorName?: string;
};

const MacrosProgressBarDashboard = ({
  label,
  current,
  target,
  unit = "g",
  colorName = "bg-blue-500",
}: MacrosProgressBarDashboardProps) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const animatedWidth = useSharedValue(percentage);

  useEffect(() => {
    animatedWidth.value = withTiming(percentage, { duration: 500 });
  }, [percentage, animatedWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View className="w-full py-1.5">
      <View className="flex-row justify-between items-baseline mb-1.5">
        <Typography.Paragraph className="text-base font-bold text-zinc-900 dark:text-white capitalize">
          {label}
        </Typography.Paragraph>
        <View className="flex-row items-baseline">
          <Typography.Paragraph
            className="text-base font-bold text-zinc-900 dark:text-white"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {Math.round(current)} / {Math.round(target)}
          </Typography.Paragraph>
          <Typography.Paragraph className="text-xs font-semibold text-zinc-400 dark:text-zinc-550 ml-0.5">
            {unit}
          </Typography.Paragraph>
        </View>
      </View>
      <View
        className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden"
        style={{ borderCurve: "continuous" }}
      >
        <Animated.View className={`h-full rounded-full ${colorName}`} style={animatedStyle} />
      </View>
    </View>
  );
};

export default MacrosProgressBarDashboard;
