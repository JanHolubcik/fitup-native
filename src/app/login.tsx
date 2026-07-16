import React, { useState, ComponentProps } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Typography } from "heroui-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../hooks/useTranslation";
import { useUniwind } from "uniwind";
import { authClient } from "../lib/auth-client";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import { router } from "expo-router";

type FontAwesomeIconName = ComponentProps<typeof FontAwesome>["name"];

type OAuthButtonProps = {
  provider: "google" | "github" | "discord";
  icon: FontAwesomeIconName;
  labelKey: string;
  onPress: (provider: "google" | "github" | "discord") => Promise<void>;
  loading: boolean;
  isDark: boolean;
};

const OAuthButton = ({ provider, icon, labelKey, onPress, loading, isDark }: OAuthButtonProps) => {
  return (
    <Pressable
      className="w-16 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 justify-center items-center"
      style={({ pressed }) => ({
        borderCurve: "continuous",
        opacity: pressed ? 0.75 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
      onPress={() => onPress(provider)}
      disabled={loading}
      accessibilityLabel={labelKey}
    >
      <FontAwesome name={icon} size={20} color={isDark ? "#ffffff" : "#18181b"} />
    </Pressable>
  );
};

const LoginScreen = () => {
  const { t } = useTranslation(["login", "signup"]);
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const [isSignUp, setIsSignUp] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  const handleSocialSignIn = async (provider: "google" | "github" | "discord") => {
    setSocialLoading(true);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/(tabs)/dashboard",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSocialLoading(false);
    }
  };

  const loading = formLoading || socialLoading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white dark:bg-zinc-950"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingBottom: 40,
          paddingTop: Platform.OS === "ios" ? 60 : 40,
        }}
      >
        <View className="w-full max-w-md mx-auto">
          {/* Top Fitness Branding Header */}
          <View className="items-center mb-8">
            <Typography.Paragraph className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1.5">
              FitUp
            </Typography.Paragraph>
            <View
              className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-3xl items-center justify-center mb-4"
              style={{
                borderCurve: "continuous",
                boxShadow: isDark
                  ? "0 10px 20px rgba(59, 130, 246, 0.15)"
                  : "0 10px 20px rgba(59, 130, 246, 0.25)",
              }}
            >
              <Ionicons name="flame" size={32} color="white" />
            </View>
            <Typography.Heading
              type="h1"
              className="text-3xl font-extrabold text-zinc-900 dark:text-white text-center tracking-tight"
            >
              {isSignUp ? t("signup.title") : t("login.title")}
            </Typography.Heading>
            <Typography.Paragraph className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-2 max-w-[280px]">
              {isSignUp ? t("signup.subtitle") : t("login.subtitle")}
            </Typography.Paragraph>
          </View>

          {/* Form Fields & Transitions */}
          <Animated.View layout={LinearTransition} className="gap-5">
            {isSignUp ? (
              <Animated.View
                key="register-form"
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(150)}
              >
                <RegisterForm onLoadingChange={setFormLoading} disabled={loading} />
              </Animated.View>
            ) : (
              <Animated.View
                key="login-form"
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(150)}
              >
                <LoginForm onLoadingChange={setFormLoading} disabled={loading} />
              </Animated.View>
            )}

            <View className="flex-row justify-center items-center mt-2 mb-2">
              <Typography.Paragraph className="text-zinc-500 dark:text-zinc-400 text-sm">
                {isSignUp ? t("signup.hasAccountText") : t("login.noAccountText")}
              </Typography.Paragraph>
              <Pressable
                onPress={() => {
                  if (!loading) {
                    setIsSignUp(!isSignUp);
                  }
                }}
                className="ml-1 active:opacity-75"
                disabled={loading}
              >
                <Typography.Paragraph className="text-blue-600 dark:text-blue-500 font-bold text-sm">
                  {isSignUp ? t("signup.logInLink") : t("login.signUpLink")}
                </Typography.Paragraph>
              </Pressable>
            </View>

            <View className="flex-row items-center my-2">
              <View className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800" />
              <Typography.Paragraph className="mx-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                {t("login.orText")}
              </Typography.Paragraph>
              <View className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800" />
            </View>

            {/* Side-by-side Squircle OAuth Buttons */}
            <View className="flex-row justify-center gap-4 mb-4">
              <OAuthButton
                provider="google"
                icon="google"
                labelKey={t("login.signInWithGoogle")}
                onPress={handleSocialSignIn}
                loading={loading}
                isDark={isDark}
              />
              <OAuthButton
                provider="github"
                icon="github"
                labelKey={t("login.signInWithGitHub")}
                onPress={handleSocialSignIn}
                loading={loading}
                isDark={isDark}
              />
              <OAuthButton
                provider="discord"
                icon="gamepad"
                labelKey={t("login.signInWithDiscord")}
                onPress={handleSocialSignIn}
                loading={loading}
                isDark={isDark}
              />
            </View>

            {!isSignUp && (
              <View className="flex-row flex-wrap justify-center items-center mt-2 px-4">
                <Typography.Paragraph className="text-xs text-zinc-400 dark:text-zinc-500 text-center">
                  {t("login.byContinuing")}
                </Typography.Paragraph>
                <Pressable onPress={() => router.push("/terms")} className="active:opacity-70">
                  <Typography.Paragraph className="text-xs font-semibold text-blue-600 dark:text-blue-500">
                    {t("signup.termsOfUseLinkText")}
                  </Typography.Paragraph>
                </Pressable>
                <Typography.Paragraph className="text-xs text-zinc-400 dark:text-zinc-500">
                  {t("signup.andText")}
                </Typography.Paragraph>
                <Pressable onPress={() => router.push("/privacy")} className="active:opacity-70">
                  <Typography.Paragraph className="text-xs font-semibold text-blue-600 dark:text-blue-500">
                    {t("signup.privacyPolicyLinkText")}
                  </Typography.Paragraph>
                </Pressable>
                <Typography.Paragraph className="text-xs text-zinc-400 dark:text-zinc-500">
                  {t("signup.agreePeriod")}
                </Typography.Paragraph>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
