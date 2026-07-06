import React from "react";
import { View } from "react-native";
import { Button } from "heroui-native";
import { useFormikContext } from "formik";

import WeightInput from "./components/WeightInput";
import WeightGoalInput from "./components/WeightGoalInput";
import HeightInput from "./components/HeightInput";
import ActivityLevelSelect from "./components/ActivityLevelSelect";
import GoalSelect from "./components/GoalSelect";
import CardUniversal from "@/app/components/common/CardUniversal";
import { useTranslation } from "react-i18next";

const BiometricAndGoalsForm = () => {
  const { t } = useTranslation("profile");
  const { handleSubmit, isSubmitting, isValid } = useFormikContext();

  const isButtonDisabled = isSubmitting || !isValid;

  return (
    <CardUniversal.Body className="px-6 py-6 gap-5">
      <View className="gap-4">
        <WeightInput />
        <WeightGoalInput />
        <HeightInput />
        <ActivityLevelSelect />
        <GoalSelect />

        <Button
          className={`bg-blue-600 dark:bg-blue-500 py-3 rounded-2xl items-center justify-center mt-3 h-12 shadow-md shadow-blue-500/10 active:opacity-90 ${
            isButtonDisabled ? "opacity-60" : ""
          }`}
          onPress={() => handleSubmit()}
          isDisabled={isButtonDisabled}
        >
          <Button.Label className="text-white font-bold text-sm tracking-wide">
            {isSubmitting ? t("toast.biometricPending") : t("updateBiometrics")}
          </Button.Label>
        </Button>
      </View>
    </CardUniversal.Body>
  );
};

export default BiometricAndGoalsForm;
