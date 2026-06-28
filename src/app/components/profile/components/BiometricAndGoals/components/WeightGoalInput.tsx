import React from "react";
import { TextField, Label, Input } from "heroui-native";
import { useFormikContext } from "formik";
import { useUniwind } from "uniwind";
import { useTranslation } from "../../../../../../hooks/useTranslation";

const WeightGoalInput = () => {
  const { t } = useTranslation("profile");
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const { values, handleChange, handleBlur, isSubmitting } = useFormikContext<{
    weightGoal: string;
  }>();

  return (
    <TextField isDisabled={isSubmitting}>
      <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
        {t("goalWeight")}
      </Label>
      <Input
        className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl text-zinc-900 dark:text-white text-sm h-12 focus:border-blue-500"
        value={values.weightGoal}
        onChangeText={handleChange("weightGoal")}
        onBlur={handleBlur("weightGoal")}
        placeholder="75"
        placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
        keyboardType="numeric"
      />
    </TextField>
  );
};

export default WeightGoalInput;
