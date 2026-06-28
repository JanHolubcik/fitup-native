import React from "react";
import { View } from "react-native";
import { TextField, Label, Input, Typography } from "heroui-native";
import { useFormikContext } from "formik";
import { useUniwind } from "uniwind";
import { useTranslation } from "../../../../../../hooks/useTranslation";

const WeightInput = () => {
  const { t } = useTranslation("profile");
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const { values, handleChange, handleBlur, isSubmitting, errors, touched } = useFormikContext<{
    weight: string;
  }>();

  const hasError = !!(touched.weight && errors.weight);

  return (
    <View>
      <TextField isRequired isDisabled={isSubmitting}>
        <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
          {t("currentWeight")}
        </Label>
        <Input
          className={`bg-zinc-50 dark:bg-zinc-950 border px-4 py-3 rounded-2xl text-zinc-900 dark:text-white text-sm h-12 ${
            hasError
              ? "border-red-500 dark:border-red-500"
              : "border-zinc-200 dark:border-zinc-800 focus:border-blue-500"
          }`}
          value={values.weight}
          onChangeText={handleChange("weight")}
          onBlur={handleBlur("weight")}
          placeholder="80"
          placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
          keyboardType="numeric"
        />
      </TextField>
      {hasError && (
        <Typography.Paragraph className="text-red-500 text-xs mt-1 ml-1">
          {t(errors.weight!)}
        </Typography.Paragraph>
      )}
    </View>
  );
};

export default WeightInput;
