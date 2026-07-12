import React from "react";
import { TextField, Label, Select, Typography } from "heroui-native";
import { useFormikContext } from "formik";
import { useUniwind } from "uniwind";
import { useTranslation } from "../../../../../../hooks/useTranslation";

const ACTIVITY_OPTIONS = [
  { value: "sedentary", labelKey: "sedentary" },
  { value: "lightlyActive", labelKey: "lightlyActive" },
  { value: "mediumActive", labelKey: "moderatelyActive" },
  { value: "highlyActive", labelKey: "veryActive" },
] as const;

const ActivityLevelSelect = () => {
  const { t } = useTranslation("profile");
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const { values, setFieldValue, isSubmitting } = useFormikContext<{ activityLevel: string }>();

  const activityOptions = ACTIVITY_OPTIONS.map((opt) => ({
    value: opt.value,
    label: t(opt.labelKey),
  }));

  const selectedActivity =
    activityOptions.find((opt) => opt.value === values.activityLevel) || activityOptions[0];

  return (
    <TextField isRequired isDisabled={isSubmitting}>
      <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
        {t("activityLevel")}
      </Label>
      <Select
        value={selectedActivity}
        onValueChange={(opt) => setFieldValue("activityLevel", opt?.value)}
        presentation="dialog"
      >
        <Select.Trigger className="flex-row items-center justify-between border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 h-12 w-full">
          <Typography.Paragraph className="text-zinc-900 dark:text-white text-sm">
            {selectedActivity.label}
          </Typography.Paragraph>
          <Select.TriggerIndicator />
        </Select.Trigger>
        <Select.Portal>
          <Select.Overlay className="bg-black/50" />
          <Select.Content
            presentation="dialog"
            className={`bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-[80%] max-w-[280px] self-center ${isDark ? "dark" : ""}`}
          >
            <Select.ListLabel className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3 px-2">
              {t("activityLevel")}
            </Select.ListLabel>
            {activityOptions.map((opt, index) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                label={opt.label}
                className={`flex-row items-center justify-between py-3 px-3 rounded-xl active:bg-zinc-100 dark:active:bg-zinc-800 ${index > 0 ? "mt-1" : ""}`}
              >
                <Select.ItemLabel className="text-zinc-900 dark:text-white font-semibold text-sm" />
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Portal>
      </Select>
    </TextField>
  );
};

export default ActivityLevelSelect;
