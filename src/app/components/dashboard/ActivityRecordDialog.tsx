import React, { useState, useMemo, useRef } from "react";
import { View, TextInput, Pressable, ScrollView } from "react-native";
import { Dialog, Typography, Button, TextField, Label, useToast } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { useUniwind } from "uniwind";

import { useTranslation } from "@/hooks/useTranslation";
import { ActivityClass } from "@/types/Types";
import useActivityOperations from "@/hooks/useActivityOperations";

export type ActivityRecord = {
  _id: string;
  activity: string;
  durationMinutes: number;
  caloriesBurned?: number;
};

type ActivityRecordDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  activities?: ActivityClass[];
  userWeightKg?: number;
  existingRecord?: ActivityRecord | null;
  onCloseAll?: () => void;
};

const ActivityRecordDialog = ({
  isOpen,
  onOpenChange,
  activities = [],
  userWeightKg = 70,
  existingRecord = null,
  onCloseAll,
}: ActivityRecordDialogProps) => {
  const isEditMode = !!existingRecord;

  const initialCategory = useMemo(() => {
    if (existingRecord) {
      const matchedActivity = activities.find(
        (a) => (a._id ? a._id.toString() : a.id) === existingRecord.activity
      );
      if (matchedActivity) return matchedActivity.category || "General";
    }
    return "";
  }, [existingRecord, activities]);

  const initialActivityName = useMemo(() => {
    if (existingRecord) {
      const matchedActivity = activities.find(
        (a) => (a._id ? a._id.toString() : a.id) === existingRecord.activity
      );
      if (matchedActivity) return matchedActivity.name;
    }
    return "";
  }, [existingRecord, activities]);

  const initialMinutes = existingRecord ? existingRecord.durationMinutes : 30;

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedActivityName, setSelectedActivityName] = useState<string>(initialActivityName);
  const [minutes, setMinutes] = useState<number>(initialMinutes);
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [minutesFocused, setMinutesFocused] = useState(false);

  const { addActivityRecord, updateActivity } = useActivityOperations();
  const { t, locale } = useTranslation("dashboard");
  const { toast } = useToast();
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const getLocalizedName = (act: ActivityClass): string => {
    const map = act.localizedNames;
    if (!map) return act.name;
    const currentLocale = locale || "en";
    return map[currentLocale] || act.name;
  };

  const categories = useMemo(() => {
    const cats = activities.map((a) => a.category || "General");
    return Array.from(new Set(cats)).sort();
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (!selectedCategory) return [];
    return activities
      .filter((a) => (a.category || "General") === selectedCategory)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activities, selectedCategory]);

  const selectedActivity = useMemo(() => {
    return activities.find((a) => a.name === selectedActivityName) || null;
  }, [activities, selectedActivityName]);

  const caloriesBurned = selectedActivity
    ? Math.round(selectedActivity.metValue * userWeightKg * (minutes / 60))
    : 0;

  const handleSave = async () => {
    if (isSavingRef.current) return;

    if (!selectedActivity) {
      toast.show({ label: t("newActivityModal.toastNoActivity"), variant: "danger" });
      return;
    }

    if (minutes < 1) {
      toast.show({ label: t("newActivityModal.toastBadValue"), variant: "danger" });
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);

    const activityId = (selectedActivity._id || selectedActivity.id || "").toString();

    const payload = {
      activity: activityId,
      durationMinutes: minutes,
      caloriesBurned: caloriesBurned,
    };

    try {
      if (isEditMode && existingRecord) {
        await updateActivity({
          id: existingRecord._id,
          ...payload,
        });
      } else {
        await addActivityRecord(payload);
      }

      onOpenChange(false);
      if (onCloseAll) {
        onCloseAll();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
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
              className="font-bold text-zinc-900 dark:text-white capitalize text-lg"
            >
              {isEditMode ? t("editActivityModal.title") : t("newActivityModal.title")}
            </Typography.Heading>
            <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400">
              {isEditMode ? t("editActivityModal.subtitle") : t("newActivityModal.subtitle")}
            </Typography.Paragraph>
          </View>

          {/* Category Selector */}
          <View className="relative w-full z-20">
            <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
              {t("newActivityModal.categoryLabel")}
            </Label>
            <Pressable
              onPress={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsActivityOpen(false);
              }}
              className={`w-full flex-row items-center justify-between px-4 h-14 rounded-2xl border ${
                isCategoryOpen
                  ? "border-blue-500 bg-white dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
              }`}
              style={{ borderCurve: "continuous" }}
            >
              <Typography.Paragraph
                className={`text-sm font-semibold ${
                  selectedCategory
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {selectedCategory
                  ? t(`activity.categories.${selectedCategory}`)
                  : t("newActivityModal.categoryPlaceholder")}
              </Typography.Paragraph>
              <Ionicons
                name={isCategoryOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={isDark ? "#a1a1aa" : "#71717a"}
              />
            </Pressable>

            {isCategoryOpen && (
              <View className="absolute left-0 right-0 top-20 z-50 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-h-48 overflow-hidden">
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {categories.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setSelectedActivityName("");
                        setIsCategoryOpen(false);
                      }}
                      className={`px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 flex-row justify-between items-center ${
                        selectedCategory === cat
                          ? "bg-blue-50 dark:bg-blue-950/30"
                          : "active:bg-zinc-100 dark:active:bg-zinc-800"
                      }`}
                    >
                      <Typography.Paragraph
                        className={`text-sm font-semibold ${
                          selectedCategory === cat
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {t(`activity.categories.${cat}`)}
                      </Typography.Paragraph>
                      {selectedCategory === cat && (
                        <Ionicons name="checkmark" size={16} color="#2563eb" />
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Activity Selector */}
          <View className="relative w-full z-10">
            <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
              {t("newActivityModal.activityLabel")}
            </Label>
            <Pressable
              disabled={!selectedCategory}
              onPress={() => {
                setIsActivityOpen(!isActivityOpen);
                setIsCategoryOpen(false);
              }}
              className={`w-full flex-row items-center justify-between px-4 h-14 rounded-2xl border ${
                !selectedCategory
                  ? "border-zinc-200 dark:border-zinc-800/50 bg-zinc-100/50 dark:bg-zinc-800/20 opacity-50"
                  : isActivityOpen
                    ? "border-blue-500 bg-white dark:bg-zinc-900"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
              }`}
              style={{ borderCurve: "continuous" }}
            >
              <Typography.Paragraph
                className={`text-sm font-semibold ${
                  selectedActivityName
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                {selectedActivityName && selectedActivity
                  ? getLocalizedName(selectedActivity)
                  : t("newActivityModal.activityPlaceholder")}
              </Typography.Paragraph>
              <Ionicons
                name={isActivityOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={isDark ? "#a1a1aa" : "#71717a"}
              />
            </Pressable>

            {isActivityOpen && (
              <View className="absolute left-0 right-0 top-20 z-50 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl max-h-48 overflow-hidden">
                <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {filteredActivities.map((act) => (
                    <Pressable
                      key={act.name}
                      onPress={() => {
                        setSelectedActivityName(act.name);
                        setIsActivityOpen(false);
                      }}
                      className={`px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 flex-row justify-between items-center ${
                        selectedActivityName === act.name
                          ? "bg-blue-50 dark:bg-blue-950/30"
                          : "active:bg-zinc-100 dark:active:bg-zinc-800"
                      }`}
                    >
                      <Typography.Paragraph
                        className={`text-sm font-semibold ${
                          selectedActivityName === act.name
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {getLocalizedName(act)}
                      </Typography.Paragraph>
                      {selectedActivityName === act.name && (
                        <Ionicons name="checkmark" size={16} color="#2563eb" />
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Duration Input */}
          <TextField isRequired>
            <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
              {t("newActivityModal.durationLabel")}
            </Label>
            <View
              className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl px-4 h-14 ${
                minutesFocused
                  ? "border-blue-500 bg-white dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
              style={{ borderCurve: "continuous" }}
            >
              <TextInput
                className="flex-1 text-zinc-900 dark:text-white text-base h-full py-0 font-semibold"
                style={{ paddingVertical: 0 }}
                keyboardType="numeric"
                value={minutes === 0 ? "" : minutes.toString()}
                onChangeText={(val) => setMinutes(Math.max(0, parseInt(val, 10) || 0))}
                placeholder="0"
                placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
                onFocus={() => setMinutesFocused(true)}
                onBlur={() => setMinutesFocused(false)}
              />
              <Typography.Paragraph className="text-zinc-400 text-sm ml-2 font-bold">
                min
              </Typography.Paragraph>
            </View>
          </TextField>

          {/* Calories / Intensity Summary Card */}
          {selectedActivity && (
            <View
              className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 gap-2"
              style={{ borderCurve: "continuous" }}
            >
              <View className="flex-row justify-between items-center">
                <Typography.Paragraph className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
                  {t("newActivityModal.caloriesBurned")}
                </Typography.Paragraph>
                <Typography.Paragraph className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                  {caloriesBurned} kcal
                </Typography.Paragraph>
              </View>

              <View className="h-px bg-zinc-200 dark:bg-zinc-800" />

              <View className="flex-row justify-between items-center">
                <Typography.Paragraph className="text-xs text-zinc-500 font-extrabold uppercase">
                  {t("newActivityModal.intensity")}
                </Typography.Paragraph>
                <Typography.Paragraph className="text-xs text-zinc-700 dark:text-zinc-300 font-bold">
                  {selectedActivity.metValue} MET
                </Typography.Paragraph>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row justify-end gap-3 mt-2">
            <Button
              variant="outline"
              className="py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 h-10 justify-center items-center"
              onPress={() => onOpenChange(false)}
              isDisabled={isSaving}
            >
              <Button.Label className="text-zinc-600 dark:text-zinc-400 text-sm font-semibold">
                {t("newActivityModal.cancel")}
              </Button.Label>
            </Button>
            <Button
              variant="primary"
              className="py-2.5 px-4 rounded-xl bg-blue-600 h-10 justify-center items-center"
              onPress={handleSave}
              isDisabled={isSaving || !selectedActivity}
            >
              <Button.Label className="text-white text-sm font-semibold">
                {isEditMode
                  ? t("editActivityModal.saveChanges")
                  : t("newActivityModal.saveChanges")}
              </Button.Label>
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default ActivityRecordDialog;
