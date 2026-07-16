import React, { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Typography, Button, TextField, Label, useToast } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { useTranslation } from "@/hooks/useTranslation";
import { useUniwind } from "uniwind";
import { authClient } from "../lib/auth-client";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";

type OnboardingFormValues = {
  goal: "loseWeight" | "maintainWeight" | "gainWeight";
  weight: string;
  height: string;
  activityLevel: "sedentary" | "lightlyActive" | "mediumActive" | "highlyActive";
};

const OnboardingScreen = () => {
  const { t } = useTranslation("onboarding");
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [weightFocused, setWeightFocused] = useState(false);
  const [heightFocused, setHeightFocused] = useState(false);

  const STEPS = [
    { id: 0, title: t("steps.welcome") },
    { id: 1, title: t("steps.yourGoal") },
    { id: 2, title: t("steps.yourDetails") },
    { id: 3, title: t("steps.review") },
  ];

  const goalLabels: Record<string, string> = {
    loseWeight: t("review.goals.loseWeight"),
    maintainWeight: t("review.goals.maintainWeight"),
    gainWeight: t("review.goals.gainWeight"),
  };

  const activityLabels: Record<string, string> = {
    sedentary: t("review.activities.sedentary"),
    lightlyActive: t("review.activities.lightlyActive"),
    mediumActive: t("review.activities.mediumActive"),
    highlyActive: t("review.activities.highlyActive"),
  };

  const validateForm = (values: OnboardingFormValues) => {
    const errors: Record<string, string> = {};
    if (!values.weight) {
      errors.weight = t("validation.weightRequired");
    } else {
      const w = Number(values.weight);
      if (isNaN(w) || w < 50) {
        errors.weight = t("validation.weightMin");
      } else if (w > 300) {
        errors.weight = t("validation.weightMax");
      }
    }

    if (!values.height) {
      errors.height = t("validation.heightRequired");
    } else {
      const h = Number(values.height);
      if (isNaN(h) || h < 50) {
        errors.height = t("validation.heightMin");
      } else if (h > 300) {
        errors.height = t("validation.heightMax");
      }
    }
    return errors;
  };

  const initialValues: OnboardingFormValues = {
    goal: "loseWeight",
    weight: "",
    height: "",
    activityLevel: "lightlyActive",
  };

  const handleFormSubmit = async (values: OnboardingFormValues) => {
    try {
      const { error } = await authClient.updateUser({
        goal: values.goal,
        weight: Number(values.weight),
        height: Number(values.height),
        activityLevel: values.activityLevel,
      });

      if (error) {
        toast.show({ label: error.message || t("toast.error"), variant: "danger" });
        return;
      }

      toast.show({ label: t("buttons.success"), variant: "success" });
      router.replace("/(tabs)/add-record");
    } catch (err) {
      console.error(err);
      toast.show({ label: t("toast.error"), variant: "danger" });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-grow flex-1 bg-white dark:bg-zinc-950"
    >
      <Formik initialValues={initialValues} validate={validateForm} onSubmit={handleFormSubmit}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
          isSubmitting,
        }) => (
          <ScrollView
            className="flex-grow flex-1"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
              paddingHorizontal: 24,
              paddingBottom: 40,
              paddingTop: Platform.OS === "ios" ? 70 : 50,
            }}
          >
            {/* Header step progress bar */}
            <View className="w-full">
              <View className="flex-row items-center justify-between mb-6 px-1">
                {STEPS.map((s, idx) => (
                  <Pressable
                    key={s.id}
                    onPress={() => {
                      if (s.id < step && !isSubmitting) {
                        setStep(s.id);
                      }
                    }}
                    className="flex-col items-center flex-1"
                    accessibilityRole="button"
                    accessibilityLabel={s.title}
                  >
                    <Typography.Paragraph
                      className={`text-[10px] font-bold mb-1.5 uppercase ${
                        step >= s.id ? "text-blue-500" : "text-zinc-400 dark:text-zinc-650"
                      }`}
                    >
                      {s.title}
                    </Typography.Paragraph>
                    <View
                      className={`h-1.5 w-full rounded-full ${
                        step >= s.id ? "bg-blue-500" : "bg-zinc-155 dark:bg-zinc-800"
                      }`}
                      style={{ marginRight: idx === STEPS.length - 1 ? 0 : 6 }}
                    />
                  </Pressable>
                ))}
              </View>

              {/* Steps container */}
              <View className="w-full flex-grow">
                {/* STEP 0: WELCOME */}
                {step === 0 && (
                  <Animated.View entering={FadeIn} className="flex-col gap-6 w-full items-center">
                    <View className="items-center mb-2">
                      <View
                        className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-3xl items-center justify-center mb-4"
                        style={{ borderCurve: "continuous" }}
                      >
                        <Ionicons name="flame" size={32} color="white" />
                      </View>
                      <Typography.Heading
                        type="h2"
                        className="font-extrabold text-zinc-900 dark:text-white text-center"
                      >
                        {t("welcome.title")}
                      </Typography.Heading>
                      <Typography.Paragraph className="text-zinc-500 dark:text-zinc-400 text-sm text-center px-4 mt-2 leading-relaxed">
                        {t("welcome.subtitle")}
                      </Typography.Paragraph>
                    </View>

                    <View className="w-full gap-4">
                      {/* Feature 1 */}
                      <View className="flex-row items-center gap-4 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                        <View className="bg-blue-500/10 dark:bg-blue-500/20 w-12 h-12 rounded-2xl items-center justify-center">
                          <Ionicons name="restaurant-outline" size={24} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                          <Typography.Heading
                            type="h4"
                            className="font-bold text-zinc-900 dark:text-white text-sm"
                          >
                            {t("welcome.features.logging.title")}
                          </Typography.Heading>
                          <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                            {t("welcome.features.logging.desc")}
                          </Typography.Paragraph>
                        </View>
                      </View>

                      {/* Feature 2 */}
                      <View className="flex-row items-center gap-4 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                        <View className="bg-blue-500/10 dark:bg-blue-500/20 w-12 h-12 rounded-2xl items-center justify-center">
                          <Ionicons name="barcode-outline" size={24} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                          <Typography.Heading
                            type="h4"
                            className="font-bold text-zinc-900 dark:text-white text-sm"
                          >
                            {t("welcome.features.scanner.title")}
                          </Typography.Heading>
                          <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                            {t("welcome.features.scanner.desc")}
                          </Typography.Paragraph>
                        </View>
                      </View>

                      {/* Feature 3 */}
                      <View className="flex-row items-center gap-4 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                        <View className="bg-blue-500/10 dark:bg-blue-500/20 w-12 h-12 rounded-2xl items-center justify-center">
                          <Ionicons name="camera-outline" size={24} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                          <Typography.Heading
                            type="h4"
                            className="font-bold text-zinc-900 dark:text-white text-sm"
                          >
                            {t("welcome.features.ai.title")}
                          </Typography.Heading>
                          <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                            {t("welcome.features.ai.desc")}
                          </Typography.Paragraph>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                )}

                {/* STEP 1: GOAL */}
                {step === 1 && (
                  <Animated.View entering={FadeIn} className="flex-col gap-6 w-full">
                    <Typography.Heading
                      type="h2"
                      className="font-extrabold text-zinc-900 dark:text-white text-center mb-2"
                    >
                      {t("goal.title")}
                    </Typography.Heading>

                    <View className="w-full gap-4">
                      {/* Option 1: Lose Weight */}
                      <Pressable
                        onPress={() => setFieldValue("goal", "loseWeight")}
                        className={`p-5 rounded-3xl border flex-row items-center gap-4 ${
                          values.goal === "loseWeight"
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        }`}
                        style={{ borderCurve: "continuous" }}
                      >
                        <View
                          className={`w-12 h-12 rounded-2xl items-center justify-center ${
                            values.goal === "loseWeight"
                              ? "bg-blue-500/10"
                              : "bg-zinc-50 dark:bg-zinc-850"
                          }`}
                        >
                          <Ionicons
                            name="flame-outline"
                            size={24}
                            color={values.goal === "loseWeight" ? "#3b82f6" : "#71717a"}
                          />
                        </View>
                        <View className="flex-1">
                          <Typography.Heading
                            type="h4"
                            className="font-bold text-zinc-900 dark:text-white text-base"
                          >
                            {t("goal.loseFat")}
                          </Typography.Heading>
                        </View>
                      </Pressable>

                      {/* Option 2: Maintain */}
                      <Pressable
                        onPress={() => setFieldValue("goal", "maintainWeight")}
                        className={`p-5 rounded-3xl border flex-row items-center gap-4 ${
                          values.goal === "maintainWeight"
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        }`}
                        style={{ borderCurve: "continuous" }}
                      >
                        <View
                          className={`w-12 h-12 rounded-2xl items-center justify-center ${
                            values.goal === "maintainWeight"
                              ? "bg-blue-500/10"
                              : "bg-zinc-50 dark:bg-zinc-850"
                          }`}
                        >
                          <Ionicons
                            name="scale-outline"
                            size={24}
                            color={values.goal === "maintainWeight" ? "#3b82f6" : "#71717a"}
                          />
                        </View>
                        <View className="flex-1">
                          <Typography.Heading
                            type="h4"
                            className="font-bold text-zinc-900 dark:text-white text-base"
                          >
                            {t("goal.maintain")}
                          </Typography.Heading>
                        </View>
                      </Pressable>

                      {/* Option 3: Build Muscle */}
                      <Pressable
                        onPress={() => setFieldValue("goal", "gainWeight")}
                        className={`p-5 rounded-3xl border flex-row items-center gap-4 ${
                          values.goal === "gainWeight"
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                        }`}
                        style={{ borderCurve: "continuous" }}
                      >
                        <View
                          className={`w-12 h-12 rounded-2xl items-center justify-center ${
                            values.goal === "gainWeight"
                              ? "bg-blue-500/10"
                              : "bg-zinc-50 dark:bg-zinc-850"
                          }`}
                        >
                          <Ionicons
                            name="barbell-outline"
                            size={24}
                            color={values.goal === "gainWeight" ? "#3b82f6" : "#71717a"}
                          />
                        </View>
                        <View className="flex-1">
                          <Typography.Heading
                            type="h4"
                            className="font-bold text-zinc-900 dark:text-white text-base"
                          >
                            {t("goal.buildMuscle")}
                          </Typography.Heading>
                        </View>
                      </Pressable>
                    </View>
                  </Animated.View>
                )}

                {/* STEP 2: DETAILS */}
                {step === 2 && (
                  <Animated.View entering={FadeIn} className="flex-col gap-6 w-full">
                    <Typography.Heading
                      type="h2"
                      className="font-extrabold text-zinc-900 dark:text-white text-center mb-2"
                    >
                      {t("details.title")}
                    </Typography.Heading>

                    <View className="flex-row gap-4 w-full">
                      {/* Weight Input */}
                      <View className="flex-1">
                        <TextField isRequired>
                          <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
                            {t("details.weightLabel")}
                          </Label>
                          <View
                            className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl px-4 h-14 ${
                              weightFocused
                                ? "border-blue-500 bg-white dark:bg-zinc-900"
                                : errors.weight && touched.weight
                                  ? "border-red-500 bg-white dark:bg-zinc-900"
                                  : "border-zinc-200 dark:border-zinc-800"
                            }`}
                            style={{ borderCurve: "continuous" }}
                          >
                            <TextInput
                              className="flex-grow h-full text-base font-bold text-zinc-900 dark:text-white"
                              keyboardType="numeric"
                              value={values.weight}
                              onChangeText={handleChange("weight")}
                              onBlur={() => {
                                handleBlur("weight");
                                setWeightFocused(false);
                              }}
                              onFocus={() => setWeightFocused(true)}
                            />
                          </View>
                        </TextField>
                        {touched.weight && errors.weight && (
                          <Typography.Paragraph className="text-red-500 text-xs mt-1.5 ml-1">
                            {errors.weight}
                          </Typography.Paragraph>
                        )}
                      </View>

                      {/* Height Input */}
                      <View className="flex-1">
                        <TextField isRequired>
                          <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
                            {t("details.heightLabel")}
                          </Label>
                          <View
                            className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl px-4 h-14 ${
                              heightFocused
                                ? "border-blue-500 bg-white dark:bg-zinc-900"
                                : errors.height && touched.height
                                  ? "border-red-500 bg-white dark:bg-zinc-900"
                                  : "border-zinc-200 dark:border-zinc-800"
                            }`}
                            style={{ borderCurve: "continuous" }}
                          >
                            <TextInput
                              className="flex-grow h-full text-base font-bold text-zinc-900 dark:text-white"
                              keyboardType="numeric"
                              value={values.height}
                              onChangeText={handleChange("height")}
                              onBlur={() => {
                                handleBlur("height");
                                setHeightFocused(false);
                              }}
                              onFocus={() => setHeightFocused(true)}
                            />
                          </View>
                        </TextField>
                        {touched.height && errors.height && (
                          <Typography.Paragraph className="text-red-500 text-xs mt-1.5 ml-1">
                            {errors.height}
                          </Typography.Paragraph>
                        )}
                      </View>
                    </View>

                    {/* Activity Level Selector */}
                    <View className="w-full gap-3">
                      <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
                        {t("details.activityLevel")}
                      </Label>

                      {(
                        ["sedentary", "lightlyActive", "mediumActive", "highlyActive"] as const
                      ).map((level) => (
                        <Pressable
                          key={level}
                          onPress={() => setFieldValue("activityLevel", level)}
                          className={`p-4 rounded-2xl border flex-col gap-1 ${
                            values.activityLevel === level
                              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                          }`}
                          style={{ borderCurve: "continuous" }}
                        >
                          <Typography.Heading
                            type="h4"
                            className="font-bold text-zinc-900 dark:text-white text-sm"
                          >
                            {t(`details.activity.${level}`)}
                          </Typography.Heading>
                        </Pressable>
                      ))}
                    </View>
                  </Animated.View>
                )}

                {/* STEP 3: REVIEW */}
                {step === 3 && (
                  <Animated.View entering={FadeIn} className="flex-col gap-6 w-full">
                    <View className="items-center mb-2">
                      <Typography.Heading
                        type="h2"
                        className="font-extrabold text-zinc-900 dark:text-white text-center"
                      >
                        {t("review.title")}
                      </Typography.Heading>
                      <Typography.Paragraph className="text-zinc-500 dark:text-zinc-400 text-sm text-center px-4 mt-2">
                        {t("review.subtitle")}
                      </Typography.Paragraph>
                    </View>

                    <View className="w-full gap-3">
                      {/* Goal Summary */}
                      <View className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex-row justify-between items-center">
                        <Typography.Paragraph className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                          {t("review.goalLabel")}
                        </Typography.Paragraph>
                        <Typography.Heading
                          type="h4"
                          className="font-extrabold text-zinc-900 dark:text-white text-sm"
                        >
                          {goalLabels[values.goal]}
                        </Typography.Heading>
                      </View>

                      {/* Activity Summary */}
                      <View className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex-row justify-between items-center">
                        <Typography.Paragraph className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                          {t("review.activityLevelLabel")}
                        </Typography.Paragraph>
                        <Typography.Heading
                          type="h4"
                          className="font-extrabold text-zinc-900 dark:text-white text-sm"
                        >
                          {activityLabels[values.activityLevel]}
                        </Typography.Heading>
                      </View>

                      {/* Weight Summary */}
                      <View className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex-row justify-between items-center">
                        <Typography.Paragraph className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                          {t("review.weightLabel")}
                        </Typography.Paragraph>
                        <Typography.Heading
                          type="h4"
                          className="font-extrabold text-zinc-900 dark:text-white text-sm"
                        >
                          {values.weight
                            ? `${values.weight} ${t("review.kg")}`
                            : t("review.notSet")}
                        </Typography.Heading>
                      </View>

                      {/* Height Summary */}
                      <View className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 flex-row justify-between items-center">
                        <Typography.Paragraph className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
                          {t("review.heightLabel")}
                        </Typography.Paragraph>
                        <Typography.Heading
                          type="h4"
                          className="font-extrabold text-zinc-900 dark:text-white text-sm"
                        >
                          {values.height
                            ? `${values.height} ${t("review.cm")}`
                            : t("review.notSet")}
                        </Typography.Heading>
                      </View>
                    </View>
                  </Animated.View>
                )}
              </View>
            </View>

            {/* Bottom buttons */}
            <View className="flex-row justify-between items-center mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                variant="outline"
                className="py-2 px-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-12 justify-center items-center"
                onPress={() => {
                  if (step > 0 && !isSubmitting) {
                    setStep((p) => p - 1);
                  }
                }}
                isDisabled={step === 0 || isSubmitting}
              >
                <Button.Label className="text-zinc-700 dark:text-zinc-300 text-sm font-bold">
                  {t("buttons.back")}
                </Button.Label>
              </Button>

              {step < STEPS.length - 1 ? (
                <Button
                  variant="primary"
                  className="bg-zinc-900 dark:bg-white h-12 px-6 rounded-2xl justify-center items-center"
                  onPress={() => {
                    if (step === 2) {
                      setFieldTouched("weight", true);
                      setFieldTouched("height", true);
                      const formErrors = validateForm(values);
                      if (formErrors.weight || formErrors.height) {
                        return;
                      }
                    }
                    setStep((p) => Math.min(p + 1, STEPS.length - 1));
                  }}
                >
                  <Button.Label className="text-white dark:text-zinc-900 text-sm font-bold">
                    {t("buttons.continue")}
                  </Button.Label>
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="bg-blue-600 h-12 px-6 rounded-2xl justify-center items-center"
                  onPress={() => handleSubmit()}
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Button.Label className="text-white text-sm font-bold">
                      {t("buttons.completeSetup")}
                    </Button.Label>
                  )}
                </Button>
              )}
            </View>
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default OnboardingScreen;
