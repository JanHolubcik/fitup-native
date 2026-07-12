import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "heroui-native";
import { useUniwind } from "uniwind";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

import { useTranslation } from "@/hooks/useTranslation";
import { timeOfDay, TimeOfDay } from "@/types/Types";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import CardUniversal from "../common/CardUniversal";
import TimeFrameSmallCard from "./TimeFrameSmallCard";

const CollapsibleContainer = ({ isExpanded, children }: { isExpanded: boolean; children: React.ReactNode }) => {
  const [height, setHeight] = useState(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isExpanded ? height : 0, { duration: 250 }),
      opacity: withTiming(isExpanded ? 1 : 0, { duration: 200 }),
      overflow: "hidden",
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <View
        style={{ position: "absolute", width: "100%" }}
        onLayout={(e) => {
          const measuredHeight = e.nativeEvent.layout.height;
          if (measuredHeight > 0 && measuredHeight !== height) {
            setHeight(measuredHeight);
          }
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
};

const AccordionTimeFrame = () => {
  const { savedFood } = useYourIntakeOperations();
  const { t } = useTranslation("dashboard");
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const [expandedSections, setExpandedSections] = useState<Record<TimeOfDay, boolean>>({
    breakfast: true,
    lunch: true,
    dinner: true,
  });

  const toggleSection = (section: TimeOfDay) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getSectionIcon = (section: TimeOfDay) => {
    switch (section) {
      case "breakfast":
        return "cafe-outline";
      case "lunch":
        return "restaurant-outline";
      case "dinner":
        return "pizza-outline";
      default:
        return "restaurant-outline";
    }
  };

  const iconColor = "#006fee";

  return (
    <CardUniversal className="w-full border-zinc-200 dark:border-zinc-800 shadow-md">
      <CardUniversal.Body className="p-3 gap-3">
        {timeOfDay.map((key) => {
          const isExpanded = expandedSections[key];
          const foodItems = savedFood[key] || [];
          const itemCount = foodItems.length;

          let subtitle = "";
          if (itemCount === 0) {
            subtitle = t("accordion.itemsLogged0");
          } else if (itemCount === 1) {
            subtitle = t("accordion.itemsLogged1");
          } else if (itemCount >= 2 && itemCount <= 4) {
            subtitle = t("accordion.itemsLogged234", { count: itemCount });
          } else {
            subtitle = t("accordion.itemsLogged5plus", { count: itemCount });
          }

          return (
            <View key={key} className="flex-col">
              <Pressable
                onPress={() => toggleSection(key)}
                className="flex-row items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/20 active:bg-zinc-100 dark:active:bg-zinc-800"
                style={{ borderCurve: "continuous" }}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={`w-10 h-10 items-center justify-center rounded-xl ${
                      isExpanded
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : "bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50"
                    }`}
                    style={{ borderCurve: "continuous" }}
                  >
                    <Ionicons
                      name={getSectionIcon(key)}
                      size={20}
                      color={isExpanded ? "#3b82f6" : "#71717a"}
                    />
                  </View>

                  <View className="flex-col items-start">
                    <Typography.Heading
                      type="h4"
                      className="text-sm font-extrabold capitalize text-blue-600 dark:text-blue-400"
                    >
                      {t(`timeOfDay.${key}`)}
                    </Typography.Heading>
                    <Typography.Paragraph className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold">
                      {subtitle}
                    </Typography.Paragraph>
                  </View>
                </View>

                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={iconColor}
                />
              </Pressable>

              <CollapsibleContainer isExpanded={isExpanded}>
                <View className="mt-2">
                  <TimeFrameSmallCard timeFrame={key} foodItems={foodItems} />
                </View>
              </CollapsibleContainer>
            </View>
          );
        })}
      </CardUniversal.Body>
    </CardUniversal>
  );
};

export default AccordionTimeFrame;
