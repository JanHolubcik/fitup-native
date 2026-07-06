import React, { useState } from "react";
import { View, ActivityIndicator, Pressable, TextInput } from "react-native";
import { Button, Typography, TextField, Label } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../../../hooks/useTranslation";
import { useUniwind } from "uniwind";
import { authClient } from "../../lib/auth-client";
import { router } from "expo-router";
import { useFormik } from "formik";

type LoginFormProps = {
  onLoadingChange: (loading: boolean) => void;
  disabled: boolean;
};

const LoginForm = ({ onLoadingChange, disabled }: LoginFormProps) => {
  const { t } = useTranslation(["login", "signup"]);
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.email) {
        errors.email = t("signup.errors.missingFields");
      }
      if (!values.password) {
        errors.password = t("signup.errors.missingFields");
      }
      return errors;
    },
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setStatus(null);
      onLoadingChange(true);

      try {
        const signInRes = await authClient.signIn.email({
          email: values.email,
          password: values.password,
        });
        if (signInRes.error) {
          setStatus(signInRes.error.message || t("login.invalidEmailPassword"));
        } else {
          router.replace("/(tabs)/dashboard");
        }
      } catch (err) {
        setStatus(t("signup.errors.serverError"));
      } finally {
        setSubmitting(false);
        onLoadingChange(false);
      }
    },
  });

  const isFormDisabled = disabled || formik.isSubmitting;

  return (
    <View className="gap-5">
      <View>
        <TextField isRequired>
          <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
            {t("login.emailLabel")}
          </Label>
          <View
            className={`flex-row items-center bg-zinc-50 dark:bg-zinc-900 border rounded-2xl px-4 h-14 ${
              emailFocused
                ? "border-blue-500 dark:border-blue-500 bg-white dark:bg-zinc-900"
                : "border-zinc-200 dark:border-zinc-800"
            } ${formik.touched.email && formik.errors.email ? "border-red-500 dark:border-red-500" : ""}`}
            style={{
              borderCurve: "continuous",
              ...(emailFocused ? { boxShadow: "0 4px 12px rgba(59, 130, 246, 0.08)" } : {}),
            }}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={emailFocused ? "#3b82f6" : (isDark ? "#52525b" : "#a1a1aa")}
              style={{ marginRight: 10 }}
            />
            <TextInput
              className="flex-1 text-zinc-900 dark:text-white text-base h-full py-0"
              style={{ paddingVertical: 0 }}
              value={formik.values.email}
              onChangeText={formik.handleChange("email")}
              onBlur={(e) => {
                formik.handleBlur("email")(e);
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
        {formik.touched.email && formik.errors.email && (
          <Typography.Paragraph className="text-red-500 text-xs mt-1 ml-1">
            {formik.errors.email}
          </Typography.Paragraph>
        )}
      </View>

      <View>
        <TextField isRequired>
          <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
            {t("login.passwordLabel")}
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
              color={passwordFocused ? "#3b82f6" : (isDark ? "#52525b" : "#a1a1aa")}
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

      {formik.status && (
        <Typography.Paragraph className="text-red-500 text-sm font-semibold text-center mt-1">
          {formik.status}
        </Typography.Paragraph>
      )}

      <Button
        variant="primary"
        className="mt-4 bg-blue-600 dark:bg-blue-500 rounded-2xl h-14 justify-center items-center active:opacity-90"
        onPress={() => formik.handleSubmit()}
        isDisabled={isFormDisabled}
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
            t("login.signInButton")
          )}
        </Button.Label>
      </Button>
    </View>
  );
};

export default LoginForm;
