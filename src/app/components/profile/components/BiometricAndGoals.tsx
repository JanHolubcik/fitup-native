import React from "react";
import { View } from "react-native";
import {
  Separator,
  Typography,
  Button,
  TextField,
  Label,
  Input,
  useToast,
  Select,
} from "heroui-native";
import { useUniwind } from "uniwind";
import { Formik } from "formik";
import { useTranslation } from "../../../../hooks/useTranslation";
import { authClient } from "../../../lib/auth-client";
import { CardUniversal } from "../../common/CardUniversal";

type User = typeof authClient.$Infer.Session.user;

type BiometricAndGoalsProps = {
  user: User;
};

const BiometricAndGoals = ({ user }: BiometricAndGoalsProps) => {
  const { t } = useTranslation("profile");
  const { toast } = useToast();
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const handleBiometricsSubmit = async (values: {
    weight: string;
    weightGoal: string;
    height: string;
    activityLevel: string;
    goal: string;
  }) => {
    try {
      const { error } = await authClient.updateUser({
        weight: values.weight ? Number(values.weight) : null,
        weightGoal: values.weightGoal ? Number(values.weightGoal) : null,
        height: values.height ? Number(values.height) : null,
        activityLevel: values.activityLevel,
        goal: values.goal,
      });

      if (error) {
        toast.show({ label: error.message || t("toast.error"), variant: "danger" });
      } else {
        toast.show({ label: t("toast.biometricSuccess"), variant: "success" });
        void authClient.getSession({ fetchOptions: { cache: "no-cache" } });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toast.error");
      toast.show({ label: msg, variant: "danger" });
    }
  };

  const activityOptions = [
    { value: "sedentary", label: t("sedentary") },
    { value: "lightlyActive", label: t("lightlyActive") },
    { value: "mediumActive", label: t("moderatelyActive") },
    { value: "highlyActive", label: t("veryActive") },
  ];

  const goalOptions = [
    { value: "loseWeight", label: t("loseFat") },
    { value: "maintainWeight", label: t("maintainWeight") },
    { value: "gainWeight", label: t("buildMuscle") },
  ];

  return (
    <CardUniversal>
      <CardUniversal.Header className="pb-2 pt-6 px-6 flex flex-col items-start gap-1">
        <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
          {t("biometricsAndGoals")}
        </Typography.Heading>
      </CardUniversal.Header>
      <Separator className="bg-zinc-200 dark:bg-zinc-800" />

      <Formik
        initialValues={{
          weight: user?.weight ? String(user.weight) : "",
          weightGoal: user?.weightGoal ? String(user.weightGoal) : "",
          height: user?.height ? String(user.height) : "",
          activityLevel: user?.activityLevel || "sedentary",
          goal: user?.goal || "loseWeight",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await handleBiometricsSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => {
          const selectedActivity =
            activityOptions.find((opt) => opt.value === values.activityLevel) || activityOptions[0];
          const selectedGoal =
            goalOptions.find((opt) => opt.value === values.goal) || goalOptions[0];

          return (
            <CardUniversal.Body className="px-6 py-6 gap-5">
              <View className="gap-4">
                {/* Weight Input */}
                <TextField isRequired isDisabled={isSubmitting}>
                  <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
                    {t("currentWeight")}
                  </Label>
                  <Input
                    className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl text-zinc-900 dark:text-white text-sm h-12 focus:border-blue-500"
                    value={values.weight}
                    onChangeText={handleChange("weight")}
                    onBlur={handleBlur("weight")}
                    placeholder="80"
                    placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
                    keyboardType="numeric"
                  />
                </TextField>

                {/* Goal Weight Input */}
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

                {/* Height Input */}
                <TextField isRequired isDisabled={isSubmitting}>
                  <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
                    {t("height")}
                  </Label>
                  <Input
                    className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl text-zinc-900 dark:text-white text-sm h-12 focus:border-blue-500"
                    value={values.height}
                    onChangeText={handleChange("height")}
                    onBlur={handleBlur("height")}
                    placeholder="180"
                    placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
                    keyboardType="numeric"
                  />
                </TextField>

                {/* Activity Level Select */}
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
                        className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-[80%] max-w-[280px] self-center"
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

                {/* Primary Goal Select */}
                <TextField isRequired isDisabled={isSubmitting}>
                  <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
                    {t("primaryGoal")}
                  </Label>
                  <Select
                    value={selectedGoal}
                    onValueChange={(opt) => setFieldValue("goal", opt?.value)}
                    presentation="dialog"
                  >
                    <Select.Trigger className="flex-row items-center justify-between border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 h-12 w-full">
                      <Typography.Paragraph className="text-zinc-900 dark:text-white text-sm">
                        {selectedGoal.label}
                      </Typography.Paragraph>
                      <Select.TriggerIndicator />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Overlay className="bg-black/50" />
                      <Select.Content
                        presentation="dialog"
                        className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-[80%] max-w-[280px] self-center"
                      >
                        <Select.ListLabel className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3 px-2">
                          {t("primaryGoal")}
                        </Select.ListLabel>
                        {goalOptions.map((opt, index) => (
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

                <Button
                  className={`bg-blue-600 dark:bg-blue-500 py-3 rounded-2xl items-center justify-center mt-3 h-12 shadow-md shadow-blue-500/10 active:opacity-90 ${
                    isSubmitting ? "opacity-60" : ""
                  }`}
                  onPress={() => handleSubmit()}
                  isDisabled={isSubmitting}
                >
                  <Button.Label className="text-white font-bold text-sm tracking-wide">
                    {isSubmitting ? t("toast.biometricPending") : t("updateBiometrics")}
                  </Button.Label>
                </Button>
              </View>
            </CardUniversal.Body>
          );
        }}
      </Formik>
    </CardUniversal>
  );
};

export default BiometricAndGoals;
