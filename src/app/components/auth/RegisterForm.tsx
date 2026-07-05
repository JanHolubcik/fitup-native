import React, { useState } from "react";
import { View, ActivityIndicator, Pressable, TextInput } from "react-native";
import { Button, Typography, TextField, Label } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUniwind } from "uniwind";
import { authClient } from "../../lib/auth-client";
import { router } from "expo-router";
import { useFormik } from "formik";
import { signupSchema } from "../../lib/validationShemas/signupValidationSchema";

type RegisterFormProps = {
  onLoadingChange: (loading: boolean) => void;
  disabled: boolean;
};

const RegisterForm = ({ onLoadingChange, disabled }: RegisterFormProps) => {
  const { t } = useTranslation("signup");
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const [showPassword, setShowPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [heightFocused, setHeightFocused] = useState(false);
  const [weightFocused, setWeightFocused] = useState(false);

  const getValidationErrorMessage = (errorKey: string) => {
    switch (errorKey) {
      case "validation.usernameMin":
        return t("validation.usernameMin");
      case "validation.emailInvalid":
        return t("validation.emailInvalid");
      case "validation.passwordMin":
        return t("validation.passwordMin");
      case "validation.heightMin":
        return t("validation.heightMin");
      case "validation.heightMax":
        return t("validation.heightMax");
      case "validation.weightMin":
        return t("validation.weightMin");
      case "validation.weightMax":
        return t("validation.weightMax");
      default:
        return "";
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      userEmail: "",
      password: "",
      height: "",
      weight: "",
      termsAccepted: false,
    },
    validate: (values) => {
      const validationResult = signupSchema.safeParse(values);

      if (validationResult.success) return {};

      const errors: Record<string, string> = {};
      const fieldErrors = validationResult.error.flatten().fieldErrors;

      Object.entries(fieldErrors).forEach(([key, messages]) => {
        if (messages && messages.length > 0) {
          errors[key] = t(messages[0]);
        }
      });

      return errors;
    },
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(null);
      onLoadingChange(true);

      try {
        const { error: signUpError } = await authClient.signUp.email({
          email: values.userEmail,
          password: values.password,
          name: values.username,
          height: Number(values.height),
          weight: Number(values.weight),
          termsAccepted: values.termsAccepted,
        });

        if (signUpError) {
          setStatus(signUpError.message || t("errors.serverError"));
        } else {
          router.replace("/(tabs)/dashboard");
        }
      } catch (err) {
        setStatus(t("errors.serverError"));
      } finally {
        setSubmitting(false);
        onLoadingChange(false);
      }
    },
  });

  const isFormDisabled = disabled || formik.isSubmitting;
  const isSubmitDisabled = isFormDisabled || !formik.values.termsAccepted;

  return (
    <View className="gap-5">
      <View>
        <TextField isRequired>
          <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
            {t("usernameLabel")}
          </Label>
          <View
            className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl px-4 h-14 ${
              nameFocused
                ? "border-blue-500 dark:border-blue-500 bg-white dark:bg-zinc-900"
                : "border-zinc-200 dark:border-zinc-800"
            } ${formik.touched.username && formik.errors.username ? "border-red-500 dark:border-red-500" : ""}`}
            style={{
              borderCurve: "continuous",
              ...(nameFocused ? { boxShadow: "0 4px 12px rgba(59, 130, 246, 0.08)" } : {}),
            }}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={nameFocused ? "#3b82f6" : isDark ? "#52525b" : "#a1a1aa"}
              style={{ marginRight: 10 }}
            />
            <TextInput
              className="flex-1 text-zinc-900 dark:text-white text-base h-full py-0"
              style={{ paddingVertical: 0 }}
              value={formik.values.username}
              onChangeText={formik.handleChange("username")}
              onBlur={(e) => {
                formik.handleBlur("username")(e);
                setNameFocused(false);
              }}
              onFocus={() => setNameFocused(true)}
              placeholder="John Doe"
              placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
              autoCapitalize="words"
              editable={!isFormDisabled}
            />
          </View>
        </TextField>
        {formik.touched.username && formik.errors.username && (
          <Typography.Paragraph className="text-red-500 text-xs mt-1 ml-1">
            {formik.errors.username}
          </Typography.Paragraph>
        )}
      </View>

      <View>
        <TextField isRequired>
          <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
            {t("emailLabel")}
          </Label>
          <View
            className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl px-4 h-14 ${
              emailFocused
                ? "border-blue-500 dark:border-blue-500 bg-white dark:bg-zinc-900"
                : "border-zinc-200 dark:border-zinc-800"
            } ${formik.touched.userEmail && formik.errors.userEmail ? "border-red-500 dark:border-red-500" : ""}`}
            style={{
              borderCurve: "continuous",
              ...(emailFocused ? { boxShadow: "0 4px 12px rgba(59, 130, 246, 0.08)" } : {}),
            }}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={emailFocused ? "#3b82f6" : isDark ? "#52525b" : "#a1a1aa"}
              style={{ marginRight: 10 }}
            />
            <TextInput
              className="flex-1 text-zinc-900 dark:text-white text-base h-full py-0"
              style={{ paddingVertical: 0 }}
              value={formik.values.userEmail}
              onChangeText={formik.handleChange("userEmail")}
              onBlur={(e) => {
                formik.handleBlur("userEmail")(e);
                setEmailFocused(false);
              }}
              onFocus={() => setEmailFocused(true)}
              placeholder="name@example.com"
              placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isFormDisabled}
            />
          </View>
        </TextField>
        {formik.touched.userEmail && formik.errors.userEmail && (
          <Typography.Paragraph className="text-red-500 text-xs mt-1 ml-1">
            {formik.errors.userEmail}
          </Typography.Paragraph>
        )}
      </View>

      <View>
        <TextField isRequired>
          <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
            {t("passwordLabel")}
          </Label>
          <View
            className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl pl-4 pr-2 h-14 ${
              passwordFocused
                ? "border-blue-500 dark:border-blue-500 bg-white dark:bg-zinc-900"
                : "border-zinc-200 dark:border-zinc-800"
            } ${formik.touched.password && formik.errors.password ? "border-red-500 dark:border-red-500" : ""}`}
            style={{
              borderCurve: "continuous",
              ...(passwordFocused ? { boxShadow: "0 4px 12px rgba(59, 130, 246, 0.08)" } : {}),
            }}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={passwordFocused ? "#3b82f6" : isDark ? "#52525b" : "#a1a1aa"}
              style={{ marginRight: 10 }}
            />
            <TextInput
              className="flex-1 text-zinc-900 dark:text-white text-base h-full py-0"
              style={{ paddingVertical: 0 }}
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              onBlur={(e) => {
                formik.handleBlur("password")(e);
                setPasswordFocused(false);
              }}
              onFocus={() => setPasswordFocused(true)}
              placeholder="••••••••"
              placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              editable={!isFormDisabled}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="justify-center items-center h-12 w-12 active:opacity-60"
              disabled={isFormDisabled}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={isDark ? "#71717a" : "#a1a1aa"}
              />
            </Pressable>
          </View>
        </TextField>
        {formik.touched.password && formik.errors.password && (
          <Typography.Paragraph className="text-red-500 text-xs mt-1 ml-1">
            {formik.errors.password}
          </Typography.Paragraph>
        )}
      </View>

      <View className="flex-row gap-4 w-full">
        <View className="flex-1">
          <TextField isRequired>
            <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
              {t("heightLabel")}
            </Label>
            <View
              className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl px-4 h-14 ${
                heightFocused
                  ? "border-blue-500 dark:border-blue-500 bg-white dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-800"
              } ${formik.touched.height && formik.errors.height ? "border-red-500 dark:border-red-500" : ""}`}
              style={{
                borderCurve: "continuous",
                ...(heightFocused ? { boxShadow: "0 4px 12px rgba(59, 130, 246, 0.08)" } : {}),
              }}
            >
              <Ionicons
                name="body-outline"
                size={20}
                color={heightFocused ? "#3b82f6" : isDark ? "#52525b" : "#a1a1aa"}
                style={{ marginRight: 10 }}
              />
              <TextInput
                className="flex-1 text-zinc-900 dark:text-white text-base h-full py-0"
                style={{ paddingVertical: 0 }}
                value={formik.values.height}
                onChangeText={formik.handleChange("height")}
                onBlur={(e) => {
                  formik.handleBlur("height")(e);
                  setHeightFocused(false);
                }}
                onFocus={() => setHeightFocused(true)}
                placeholder="180"
                placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
                keyboardType="numeric"
                editable={!isFormDisabled}
              />
            </View>
          </TextField>
          {formik.touched.height && formik.errors.height && (
            <Typography.Paragraph className="text-red-500 text-xs mt-1 ml-1">
              {formik.errors.height}
            </Typography.Paragraph>
          )}
        </View>

        <View className="flex-1">
          <TextField isRequired>
            <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
              {t("weightLabel")}
            </Label>
            <View
              className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl px-4 h-14 ${
                weightFocused
                  ? "border-blue-500 dark:border-blue-500 bg-white dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-800"
              } ${formik.touched.weight && formik.errors.weight ? "border-red-500 dark:border-red-500" : ""}`}
              style={{
                borderCurve: "continuous",
                ...(weightFocused ? { boxShadow: "0 4px 12px rgba(59, 130, 246, 0.08)" } : {}),
              }}
            >
              <Ionicons
                name="barbell-outline"
                size={20}
                color={weightFocused ? "#3b82f6" : isDark ? "#52525b" : "#a1a1aa"}
                style={{ marginRight: 10 }}
              />
              <TextInput
                className="flex-1 text-zinc-900 dark:text-white text-base h-full py-0"
                style={{ paddingVertical: 0 }}
                value={formik.values.weight}
                onChangeText={formik.handleChange("weight")}
                onBlur={(e) => {
                  formik.handleBlur("weight")(e);
                  setWeightFocused(false);
                }}
                onFocus={() => setWeightFocused(true)}
                placeholder="80"
                placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
                keyboardType="numeric"
                editable={!isFormDisabled}
              />
            </View>
          </TextField>
          {formik.touched.weight && formik.errors.weight && (
            <Typography.Paragraph className="text-red-500 text-xs mt-1 ml-1">
              {formik.errors.weight}
            </Typography.Paragraph>
          )}
        </View>
      </View>

      {/* Terms of Use & Privacy Checkbox */}
      <View className="flex-row items-start w-full my-2">
        <Pressable
          onPress={() => {
            if (!isFormDisabled) {
              formik.setFieldValue("termsAccepted", !formik.values.termsAccepted);
            }
          }}
          className="flex-row items-center active:opacity-85 mr-3 mt-0.5"
          disabled={isFormDisabled}
          accessibilityLabel={t("agreeText")}
        >
          <View
            className={`w-5 h-5 rounded-md border items-center justify-center ${
              formik.values.termsAccepted
                ? "bg-blue-600 border-blue-600"
                : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            }`}
          >
            {formik.values.termsAccepted && <Ionicons name="checkmark" size={14} color="white" />}
          </View>
        </Pressable>
        <View className="flex-1 flex-row flex-wrap items-center">
          <Pressable
            onPress={() => {
              if (!isFormDisabled) {
                formik.setFieldValue("termsAccepted", !formik.values.termsAccepted);
              }
            }}
          >
            <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("agreeText")}
            </Typography.Paragraph>
          </Pressable>
          <Pressable onPress={() => router.push("/terms")} className="active:opacity-70">
            <Typography.Paragraph className="text-xs font-semibold text-blue-600 dark:text-blue-500">
              {t("termsOfUseLinkText")}
            </Typography.Paragraph>
          </Pressable>
          <Pressable
            onPress={() => {
              if (!isFormDisabled) {
                formik.setFieldValue("termsAccepted", !formik.values.termsAccepted);
              }
            }}
          >
            <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("andText")}
            </Typography.Paragraph>
          </Pressable>
          <Pressable onPress={() => router.push("/privacy")} className="active:opacity-70">
            <Typography.Paragraph className="text-xs font-semibold text-blue-600 dark:text-blue-500">
              {t("privacyPolicyLinkText")}
            </Typography.Paragraph>
          </Pressable>
          <Pressable
            onPress={() => {
              if (!isFormDisabled) {
                formik.setFieldValue("termsAccepted", !formik.values.termsAccepted);
              }
            }}
          >
            <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("agreePeriod")}
            </Typography.Paragraph>
          </Pressable>
        </View>
      </View>

      {formik.status && (
        <Typography.Paragraph className="text-red-500 text-sm font-semibold text-center mt-1">
          {formik.status}
        </Typography.Paragraph>
      )}

      <Button
        variant="primary"
        className="mt-4 bg-blue-600 dark:bg-blue-500 rounded-2xl h-14 justify-center items-center active:opacity-90"
        onPress={() => formik.handleSubmit()}
        isDisabled={isSubmitDisabled}
        style={{
          borderCurve: "continuous",
          boxShadow: isDark
            ? "0 4px 14px rgba(59, 130, 246, 0.15)"
            : "0 4px 14px rgba(59, 130, 246, 0.25)",
        }}
      >
        <Button.Label className="text-white font-bold text-base">
          {formik.isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            t("signUpButton")
          )}
        </Button.Label>
      </Button>
    </View>
  );
};

export default RegisterForm;
