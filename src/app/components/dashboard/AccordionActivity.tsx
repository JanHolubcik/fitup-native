import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "heroui-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";

import { useTranslation } from "@/hooks/useTranslation";
import { ActivitiesOptions } from "@/lib/queriesOptions/ActivitiesOptions";
import useActivityOperations from "@/hooks/useActivityOperations";
import { LoggedActivityType, ActivityClass } from "@/types/Types";
import CardUniversal from "../common/CardUniversal";
import ActivityRecordDialog, { ActivityRecord } from "./ActivityRecordDialog";

const CollapsibleContainer = ({
  isExpanded,
  children,
}: {
  isExpanded: boolean;
  children: React.ReactNode;
}) => {
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

const AccordionActivity = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<ActivityRecord | null>(null);

  const { t, locale } = useTranslation("dashboard");
  const { data: activitiesData } = useQuery(ActivitiesOptions());
  const { savedActivities, removeFromSavedActivity } = useActivityOperations();

  const activitiesList = activitiesData || [];
  const itemCount = savedActivities.length;

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

  const getLocalizedName = (act: ActivityClass): string => {
    const map = act.localizedNames;
    if (!map) return act.name;
    const currentLocale = locale || "en";
    return map[currentLocale] || act.name;
  };

  const handleEditClick = (savedItem: LoggedActivityType) => {
    setRecordToEdit({
      _id: savedItem.id.toString(),
      activity: savedItem.activity,
      durationMinutes: savedItem.durationMinutes,
      caloriesBurned: savedItem.caloriesBurned,
    });
    setIsOpen(true);
  };

  const handleCreateNewClick = () => {
    setRecordToEdit(null);
    setIsOpen(true);
  };

  return (
    <>
      <CardUniversal className="w-full border-zinc-200 dark:border-zinc-800 shadow-md">
        <CardUniversal.Body className="p-3 gap-3">
          <View className="flex-col">
            <Pressable
              onPress={() => setIsExpanded((prev) => !prev)}
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
                    name="flash"
                    size={20}
                    color={isExpanded ? "#3b82f6" : "#71717a"}
                  />
                </View>

                <View className="flex-col items-start">
                  <Typography.Heading
                    type="h4"
                    className="text-sm font-extrabold capitalize text-blue-600 dark:text-blue-400"
                  >
                    {t("activity.dailyActivities")}
                  </Typography.Heading>
                  <Typography.Paragraph className="text-[10px] text-zinc-400 dark:text-zinc-550 font-bold">
                    {subtitle}
                  </Typography.Paragraph>
                </View>
              </View>

              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#006fee"
              />
            </Pressable>

            <CollapsibleContainer isExpanded={isExpanded}>
              <View className="mt-2 p-2 bg-zinc-100 dark:bg-zinc-950 rounded-2xl gap-2">
                {savedActivities.map((savedItem, index) => {
                  const fullActivity = activitiesList.find(
                    (a) => (a._id ? a._id.toString() : a.id) === savedItem.activity
                  );

                  if (!fullActivity) return null;

                  return (
                    <Pressable
                      key={savedItem.id || index}
                      onPress={() => handleEditClick(savedItem)}
                      className="flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-xl active:bg-zinc-50 dark:active:bg-zinc-800/80"
                      style={{ borderCurve: "continuous" }}
                    >
                      <View className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 items-center justify-center shrink-0">
                        <Ionicons name="fitness-outline" size={16} color="#71717a" />
                      </View>

                      <View className="flex-1 min-w-0 flex-col justify-center">
                        <Typography.Paragraph className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-200 capitalize">
                          {getLocalizedName(fullActivity)}
                        </Typography.Paragraph>

                        <Typography.Paragraph className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {t(`activity.categories.${fullActivity.category || "General"}`)} &middot; {savedItem.durationMinutes} min &middot; {savedItem.caloriesBurned} kcal
                        </Typography.Paragraph>
                      </View>

                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          removeFromSavedActivity(savedItem.id);
                        }}
                        className="w-8 h-8 items-center justify-center rounded-lg bg-red-500/10 active:bg-red-500/20"
                        hitSlop={8}
                      >
                        <Ionicons name="close" size={16} color="#ef4444" />
                      </Pressable>
                    </Pressable>
                  );
                })}

                <Pressable
                  onPress={handleCreateNewClick}
                  className="w-10 h-10 rounded-full bg-blue-500/10 active:bg-blue-500/20 items-center justify-center self-center my-1"
                >
                  <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
                </Pressable>
              </View>
            </CollapsibleContainer>
          </View>
        </CardUniversal.Body>
      </CardUniversal>

      <ActivityRecordDialog
        key={recordToEdit ? `edit-${recordToEdit._id}` : `new-${isOpen}`}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        activities={activitiesList}
        existingRecord={recordToEdit}
      />
    </>
  );
};

export default AccordionActivity;
