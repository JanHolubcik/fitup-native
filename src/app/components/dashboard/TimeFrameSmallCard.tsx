import React, { useState } from "react";
import { View, Pressable } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Typography } from "heroui-native";

import { Food, TimeOfDay } from "@/types/Types";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";

import { useIsSearchOpen, useActiveTimeFrame } from "@/hooks/useDashboardState";
import { useUniwind } from "uniwind";
import ImageFromURL from "../common/ImageFromURL";
import FoodRecordDialog from "./FoodRecordDialog";

type TimeFrameSmallCardProps = {
  timeFrame: TimeOfDay;
  foodItems: Food[];
};

const TimeFrameSmallCard = ({ timeFrame, foodItems }: TimeFrameSmallCardProps) => {
  const { removeFromSavedFood } = useYourIntakeOperations();

  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [, setIsSearchOpen] = useIsSearchOpen();
  const [, setActiveTimeFrame] = useActiveTimeFrame();
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const handleAddPress = () => {
    setActiveTimeFrame(timeFrame);
    setIsSearchOpen(true);
  };

  const handleEditPress = (food: Food) => {
    setSelectedFood(food);
    setIsEditOpen(true);
  };

  return (
    <View className="flex-col p-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl gap-3">
      <View className="flex-col gap-2">
        {foodItems.map((item) => (
          <View key={item.id}>
            <Pressable
              onPress={() => handleEditPress(item)}
              className="flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl active:bg-zinc-50 dark:active:bg-zinc-800"
              style={{ borderCurve: "continuous" }}
            >
              <View className="flex-row items-center gap-3 flex-1 min-w-0">
                <ImageFromURL
                  width={40}
                  height={40}
                  macroName={item.originalName || item.name}
                  url={item.imgUrl}
                />

                <View className="flex-1 min-w-0 justify-center">
                  <Typography.Heading
                    type="h4"
                    className="font-bold text-base text-zinc-900 dark:text-zinc-200 capitalize"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Typography.Heading>
                </View>
              </View>

              <View className="flex-row items-center gap-2.5 flex-shrink-0">
                <View className="items-end gap-0.5">
                  <Typography.Paragraph className="text-xs text-zinc-400 dark:text-zinc-500 font-bold">
                    {item.amount}g
                  </Typography.Paragraph>
                  <Typography.Paragraph className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1 rounded-lg font-extrabold border border-blue-100 dark:border-blue-950/30">
                    {item.calories.toFixed(0)} kcal
                  </Typography.Paragraph>
                </View>

                <Pressable
                  onPress={() => removeFromSavedFood(item.id, timeFrame)}
                  className="w-6 h-6 items-center justify-center rounded-full active:bg-red-500/10"
                >
                  <Ionicons
                    name="close"
                    size={16}
                    className="text-zinc-400 dark:text-zinc-500 active:text-red-500"
                  />
                </Pressable>
              </View>
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable
        onPress={handleAddPress}
        className="w-8 h-8 min-w-8 items-center justify-center rounded-xl bg-slate-300 dark:bg-blue-950/30 active:opacity-75 self-center my-2"
        style={{ borderCurve: "continuous" }}
      >
        <Ionicons name="add-circle" size={20} color={isDark ? "#006fee" : "#93c5fd"} />
      </Pressable>

      <FoodRecordDialog
        key={selectedFood ? `edit-${selectedFood.id}` : "edit-none"}
        mode="edit"
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        food={selectedFood}
        timeOfDay={timeFrame}
      />
    </View>
  );
};

export default TimeFrameSmallCard;
