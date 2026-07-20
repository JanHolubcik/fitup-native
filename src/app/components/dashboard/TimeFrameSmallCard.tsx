import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "heroui-native";

import { Food, TimeOfDay } from "@/types/Types";
import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { useIsSearchOpen, useActiveTimeFrame } from "@/hooks/useDashboardState";
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

  const handleAddPress = () => {
    setActiveTimeFrame(timeFrame);
    setIsSearchOpen(true);
  };

  const handleEditPress = (food: Food) => {
    setSelectedFood(food);
    setIsEditOpen(true);
  };

  return (
    <View className="p-2 bg-zinc-100 dark:bg-zinc-950 rounded-2xl gap-2">
      <View className="flex-col gap-2">
        {foodItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => handleEditPress(item)}
            className="flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-xl active:bg-zinc-50 dark:active:bg-zinc-800/80"
            style={{ borderCurve: "continuous" }}
          >
            <View className="flex-row items-center gap-3 flex-1 min-w-0">
              <View className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 items-center justify-center shrink-0 overflow-hidden">
                <ImageFromURL
                  width={32}
                  height={32}
                  macroName={item.originalName || item.name}
                  url={item.imgUrl}
                />
              </View>

              <View className="flex-1 min-w-0 justify-center">
                <Typography.Heading
                  type="h4"
                  className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-200 capitalize"
                  numberOfLines={1}
                >
                  {item.name}
                </Typography.Heading>
                <Typography.Paragraph className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {item.amount}g &middot; {item.calories.toFixed(0)} kcal
                </Typography.Paragraph>
              </View>
            </View>

            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                removeFromSavedFood(item.id, timeFrame);
              }}
              className="w-8 h-8 items-center justify-center rounded-lg bg-red-500/10 active:bg-red-500/20"
              hitSlop={8}
            >
              <Ionicons name="close" size={16} color="#ef4444" />
            </Pressable>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleAddPress}
        className="w-10 h-10 rounded-full bg-blue-500/10 active:bg-blue-500/20 items-center justify-center self-center my-1"
      >
        <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
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
