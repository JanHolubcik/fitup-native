import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Dialog, Typography, Button, TextField, Label, useToast } from "heroui-native";
import { useUniwind } from "uniwind";

import useYourIntakeOperations from "@/hooks/useYourIntakeOperations";
import { Food, TimeOfDay } from "@/types/Types";
import { useTranslation } from "@/hooks/useTranslation";
import { MACRO_TAILWIND_THEME, MacroArray } from "@/utils/MacrosHelper";
import ImageFromURL from "../common/ImageFromURL";
import { uploadImage } from "@/app/lib/api-client";


type FoodRecordModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  food: Food | null | undefined;
  timeOfDay: TimeOfDay;
  mode: "edit" | "new";
  onCloseAll?: () => void;
};

const FoodRecordModal = ({
  isOpen,
  onOpenChange,
  food,
  timeOfDay,
  mode,
  onCloseAll,
}: FoodRecordModalProps) => {
  const [grams, setGrams] = useState<number>(() => {
    return food ? parseFloat(food.amount) || 100 : 100;
  });
  const [isSaving, setIsSaving] = useState(false);
  const { updateFood, addToFoodObject } = useYourIntakeOperations();
  const { t } = useTranslation("dashboard");
  const { toast } = useToast();
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const [gramsFocused, setGramsFocused] = useState(false);

  if (!food) return null;

  const foodComponent = { ...food };
  const initialGrams = parseFloat(food.amount) || 100;
  const ratio = grams / (initialGrams || 1);

  const tBase = mode === "edit" ? "editFoodModal" : "newFoodModal";

  const handleSave = async () => {
    if (grams < 1) {
      toast.show({ label: t("modalCreateFood.toastBadValue"), variant: "danger" });
      return;
    }

    setIsSaving(true);
    try {
      if (mode === "edit") {
        await updateFood(food, grams, timeOfDay);
        onOpenChange(false);
      } else {
        let finalImgUrl = food.imgUrl;
        if (food.imgUrl && (food.imgUrl.startsWith("file://") || food.imgUrl.startsWith("content://"))) {
          try {
            finalImgUrl = await uploadImage(food.imgUrl);
          } catch (uploadErr) {
            console.error("Failed to upload food image, proceeding without image:", uploadErr);
            finalImgUrl = undefined;
          }
        }

        const updatedFood: Food = {
          ...food,
          amount: grams.toString(),
          imgUrl: finalImgUrl,
        };
        await addToFoodObject(updatedFood, timeOfDay);
        onOpenChange(false);
        if (onCloseAll) {
          onCloseAll();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };


  const getMacroLabel = (key: string) => {
    switch (key) {
      case "protein":
        return t("addFood.proteinShort");
      case "carbohydrates":
        return t("addFood.carbsShort");
      case "fat":
        return t("addFood.fatShort");
      case "sugar":
        return t("addFood.sugarShort");
      case "fiber":
        return t("addFood.fiber");
      default:
        return "";
    }
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50" />
        <Dialog.Content
          className={`w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl gap-4 ${isDark ? "dark" : ""}`}
          isSwipeable={false}
        >
          <View className="flex-col gap-1 items-start">
            <Typography.Heading
              type="h3"
              className="font-bold text-zinc-900 dark:text-white capitalize"
            >
              {t(`${tBase}.title`, { name: food.name })}
            </Typography.Heading>
            <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {t(`${tBase}.subtitle`)}
            </Typography.Paragraph>
          </View>

          <View
            className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 gap-3"
            style={{ borderCurve: "continuous" }}
          >
            <View className="flex-row justify-between items-center">
              <Typography.Paragraph className="text-sm font-bold text-zinc-500 dark:text-zinc-450">
                {t(`${tBase}.calories`)}
              </Typography.Paragraph>
              <Typography.Paragraph className="text-base font-extrabold text-zinc-900 dark:text-white">
                {Math.round(foodComponent.calories * ratio)} {t("todayMacros.kcal")}
              </Typography.Paragraph>
            </View>

            <View className="h-px bg-zinc-200 dark:bg-zinc-800" />

            <View className="flex-row gap-4 items-center">
              <ImageFromURL
                url={foodComponent.imgUrl}
                width={80}
                height={80}
                macroName={foodComponent.originalName || foodComponent.name}
              />
              <View className="flex-1 gap-1">
                {MacroArray.filter((m) => m !== "calories").map((macro) => {
                  const rawValue = foodComponent[macro as keyof Food] as number;
                  if (rawValue === undefined || rawValue === null) return null;
                  const calculatedValue = (rawValue * ratio).toFixed(1);
                  const macroTheme = MACRO_TAILWIND_THEME[macro];

                  return (
                    <View key={macro} className="flex-row justify-between items-center">
                      <Typography.Paragraph className={`text-xs font-bold ${macroTheme.text}`}>
                        {getMacroLabel(macro)}
                      </Typography.Paragraph>
                      <Typography.Paragraph className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                        {calculatedValue}g
                      </Typography.Paragraph>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <TextField isRequired>
            <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
              {t(`${tBase}.amountLabel`)}
            </Label>
            <View
              className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl px-4 h-14 ${
                gramsFocused
                  ? "border-blue-500 dark:border-blue-500 bg-white dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
              style={{ borderCurve: "continuous" }}
            >
              <TextInput
                className="flex-1 text-zinc-900 dark:text-white text-base h-full py-0"
                style={{ paddingVertical: 0 }}
                keyboardType="numeric"
                value={grams === 0 ? "" : grams.toString()}
                onChangeText={(val) => setGrams(Math.max(0, parseFloat(val) || 0))}
                placeholder="0"
                placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
                onFocus={() => setGramsFocused(true)}
                onBlur={() => setGramsFocused(false)}
              />
              <Typography.Paragraph className="text-zinc-400 text-sm ml-2 font-bold">
                g
              </Typography.Paragraph>
            </View>
          </TextField>

          <View className="flex-row justify-end gap-3 mt-2">
            <Button
              variant="outline"
              className="py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 h-10 justify-center items-center"
              onPress={() => onOpenChange(false)}
              isDisabled={isSaving}
            >
              <Button.Label className="text-zinc-600 dark:text-zinc-400 text-sm font-semibold">
                {t(`${tBase}.cancel`)}
              </Button.Label>
            </Button>
            <Button
              variant="primary"
              className="py-2.5 px-4 rounded-xl bg-blue-600 h-10 justify-center items-center"
              onPress={handleSave}
              isDisabled={isSaving}
            >
              <Button.Label className="text-white text-sm font-semibold">
                {t(`${tBase}.saveChanges`)}
              </Button.Label>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default FoodRecordModal;
