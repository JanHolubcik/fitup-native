import React from "react";
import { View, Pressable } from "react-native";
import { addDays, format, parse } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useUniwind } from "uniwind";

import { useCurrentDate } from "@/hooks/useDashboardState";
import { useTranslation } from "@/hooks/useTranslation";
import CardUniversal from "../common/CardUniversal";
import { Typography } from "heroui-native";

const DateSwitcher = () => {
  const [currentDate, setCurrentDate] = useCurrentDate();
  const { t } = useTranslation("dashboard");
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const parsedDate = parse(currentDate, "yyyy-MM-dd", new Date());

  const setNewDateAndFetchFood = (numberOfDays: number) => {
    const newDate = addDays(parsedDate, numberOfDays);
    setCurrentDate(format(newDate, "yyyy-MM-dd"));
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const disabledButton = currentDate === todayStr;

  const iconColor = "#006fee";

  return (
    <CardUniversal className="w-full border-zinc-200 dark:border-zinc-800 shadow-md">
      <CardUniversal.Body className="flex-row items-center justify-between gap-1 p-3">
        <Pressable
          onPress={() => setNewDateAndFetchFood(-1)}
          accessibilityLabel={t("dateSwitcher.previousDay")}
          className="w-10 h-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30 active:bg-blue-100 dark:active:bg-blue-900/50"
          style={{ borderCurve: "continuous" }}
        >
          <Ionicons name="chevron-back" size={20} color={iconColor} />
        </Pressable>

        <View className="flex-row items-center gap-2 bg-blue-50 dark:bg-blue-950/20 px-4 py-2 rounded-full">
          <Ionicons name="calendar-outline" size={16} color={iconColor} />
          <Typography.Paragraph className="text-blue-600 dark:text-blue-400 text-sm font-extrabold tracking-wider">
            {format(parsedDate, "dd.MM / EEE")}
          </Typography.Paragraph>
        </View>

        <Pressable
          onPress={() => setNewDateAndFetchFood(1)}
          disabled={disabledButton}
          accessibilityLabel={t("dateSwitcher.nextDay")}
          className={`w-10 h-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30 ${
            disabledButton ? "opacity-30" : "active:bg-blue-100 dark:active:bg-blue-900/50"
          }`}
          style={{ borderCurve: "continuous" }}
        >
          <Ionicons name="chevron-forward" size={20} color={iconColor} />
        </Pressable>
      </CardUniversal.Body>
    </CardUniversal>
  );
};

export default DateSwitcher;
