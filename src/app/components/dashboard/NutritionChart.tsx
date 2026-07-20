import React, { useState, useMemo } from "react";
import { View, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "heroui-native";

import CardUniversal from "../common/CardUniversal";
import { MacroType } from "@/utils/MacrosHelper";
import useNutritionChartData, { DailyNutritionalData } from "@/hooks/useNutritionChartData";
import { useTranslation } from "@/hooks/useTranslation";

type MetricType = MacroType;

type NutritionChartProps = {
  data?: DailyNutritionalData[];
};

type MetricConfig = {
  label: string;
  unit: string;
  color: string;
};

const METRIC_CONFIGS: Record<MetricType, MetricConfig> = {
  calories: {
    label: "Calories",
    unit: "kcal",
    color: "#f97316",
  },
  protein: {
    label: "Protein",
    unit: "g",
    color: "#3b82f6",
  },
  carbohydrates: {
    label: "Carbs",
    unit: "g",
    color: "#f59e0b",
  },
  fat: {
    label: "Fat",
    unit: "g",
    color: "#8b5cf6",
  },
  sugar: {
    label: "Sugar",
    unit: "g",
    color: "#ec4899",
  },
  fiber: {
    label: "Fiber",
    unit: "g",
    color: "#10b981",
  },
};

const NutritionChart = ({ data: customData }: NutritionChartProps) => {
  const { t } = useTranslation("dashboard");
  const { dailyHistory, isLoading, emptyDays, getStatsForMacro } = useNutritionChartData(6);

  const chartSourceData = customData ?? dailyHistory;

  const [selectedMetric, setSelectedMetric] = useState<MetricType>("calories");

  const activeConfig = METRIC_CONFIGS[selectedMetric];
  const stats = getStatsForMacro(selectedMetric);

  const formattedData = useMemo(() => {
    return chartSourceData.map((item) => {
      const val = item[selectedMetric];
      const isOver = stats.recValue > 0 && val > stats.recValue;
      return {
        value: val,
        label: item.date,
        dataPointColor: isOver ? "#ef4444" : activeConfig.color,
      };
    });
  }, [chartSourceData, selectedMetric, activeConfig.color, stats.recValue]);

  const chartMaxValue = useMemo(() => {
    const maxVal = Math.max(...formattedData.map((d) => d.value), stats.recValue, 10);
    return Math.ceil(maxVal * 1.25);
  }, [formattedData, stats.recValue]);

  // Fallback when less than 3 days logged
  if (!isLoading && !customData && chartSourceData.length < 3) {
    return (
      <CardUniversal className="w-full border-zinc-200 dark:border-zinc-800 shadow-md">
        <CardUniversal.Body className="p-6 items-center justify-center text-center gap-3">
          <Ionicons name="stats-chart-outline" size={56} color="#9ca3af" />
          <View className="items-center gap-1">
            <Typography.Heading
              type="h4"
              className="font-semibold text-base text-zinc-800 dark:text-zinc-200"
            >
              {t("chart.noDataYet")}
            </Typography.Heading>
            <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[240px]">
              {t("chart.logThreeDays")}
            </Typography.Paragraph>
          </View>
        </CardUniversal.Body>
      </CardUniversal>
    );
  }

  const tableData = [
    {
      label: `${stats.trackedDays}-${t("chart.dayAverage")}`,
      value: `${stats.avg} ${stats.unit}`,
      sub: `${t("chart.goal")}: ${stats.recValue} ${stats.unit}`,
      subColor: "text-zinc-500 dark:text-zinc-400",
    },
    {
      label: t("chart.weeklyPeak"),
      value: `${stats.peak} ${stats.unit}`,
      sub:
        stats.recValue > 0 && stats.peak > stats.recValue
          ? t("chart.aboveLimit")
          : t("chart.withinLimit"),
      subColor:
        stats.recValue > 0 && stats.peak > stats.recValue ? "text-red-500" : "text-emerald-500",
    },
    {
      label: t("chart.daysOverLimit"),
      value: `${stats.daysOver} / ${stats.trackedDays}`,
      sub: stats.daysOver === 0 ? t("chart.allWithinGoal") : t("chart.daysExceeded"),
      subColor: stats.daysOver > 0 ? "text-red-500" : "text-emerald-500",
    },
    {
      label: t("chart.daysNotLogged"),
      value: emptyDays,
      sub: emptyDays === 0 ? t("chart.allDaysLogged") : `${emptyDays} ${t("chart.daysMissing")}`,
      subColor: emptyDays > 0 ? "text-red-500" : "text-emerald-500",
    },
  ];

  return (
    <CardUniversal className="w-full border-zinc-200 dark:border-zinc-800 shadow-md">
      <CardUniversal.Body className="p-4 gap-4">
        {/* Header */}
        <View className="flex-col gap-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Typography.Heading
                type="h4"
                className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100"
              >
                {t(`macros.${selectedMetric}`)} {t("chart.intake")}
              </Typography.Heading>
              <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400">
                {t("chart.daysTracked", { count: stats.trackedDays })}
              </Typography.Paragraph>
            </View>
          </View>

          {/* Metric Selector Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
            className="flex-row bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl"
          >
            {(Object.keys(METRIC_CONFIGS) as MetricType[]).map((metric) => {
              const isSelected = selectedMetric === metric;
              return (
                <Pressable
                  key={metric}
                  onPress={() => setSelectedMetric(metric)}
                  className={`px-3 py-1.5 items-center rounded-lg ${
                    isSelected ? "bg-white dark:bg-zinc-700 shadow-xs" : ""
                  }`}
                >
                  <Typography.Paragraph
                    className={`text-xs font-semibold capitalize ${
                      isSelected
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    {METRIC_CONFIGS[metric].label}
                  </Typography.Paragraph>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Line Chart Area with Dynamic Animated Transitions */}
        <View className="items-center justify-center py-4 min-h-[220px]">
          {isLoading && !customData ? (
            <ActivityIndicator size="small" color={activeConfig.color} />
          ) : (
            <LineChart
              key={selectedMetric}
              data={formattedData}
              color={activeConfig.color}
              thickness={3}
              initialSpacing={18}
              endSpacing={18}
              maxValue={chartMaxValue}
              mostNegativeValue={0}
              startFillColor={activeConfig.color}
              endFillColor={`${activeConfig.color}10`}
              startOpacity={0.35}
              endOpacity={0.02}
              areaChart
              hideDataPoints={false}
              dataPointsColor={activeConfig.color}
              dataPointsRadius={4}
              hideRules
              overflowTop={10}
              overflowBottom={10}
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: "#9ca3af", fontSize: 10 }}
              xAxisLabelTextStyle={{ color: "#9ca3af", fontSize: 10 }}
              noOfSections={4}
              showReferenceLine1={stats.recValue > 0}
              referenceLine1Position={stats.recValue}
              referenceLine1Config={{
                color: "#64748b",
                dashWidth: 6,
                dashGap: 4,
                thickness: 1.5,
              }}
              isAnimated
              animationDuration={800}
              curved={false}
            />
          )}
        </View>

        {/* Reference limit legend */}
        {stats.recValue > 0 && (
          <View className="flex-row items-center gap-2 pt-1">
            <View className="w-5 h-[1.5px] border-t border-dashed border-slate-500" />
            <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("chart.recommendedLimit")} ({stats.recValue} {stats.unit})
            </Typography.Paragraph>
          </View>
        )}

        {/* Stats 2x2 Grid Cards */}
        <View className="grid grid-cols-2 gap-2 pt-2">
          {tableData.map(({ label, value, sub, subColor }) => (
            <View
              key={label}
              className="bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 rounded-xl p-2.5"
            >
              <Typography.Paragraph
                className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mb-0.5"
                numberOfLines={1}
              >
                {label}
              </Typography.Paragraph>
              <Typography.Heading
                type="h4"
                className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100"
              >
                {value}
              </Typography.Heading>
              <Typography.Paragraph
                className={`text-[10px] sm:text-xs ${subColor} mt-0.5`}
                numberOfLines={1}
              >
                {sub}
              </Typography.Paragraph>
            </View>
          ))}
        </View>
      </CardUniversal.Body>
    </CardUniversal>
  );
};

export default NutritionChart;
