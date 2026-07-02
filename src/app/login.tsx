import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Button, Typography, TextField, Input, Label } from "heroui-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "../hooks/useTranslation";
import { authClient } from "./lib/auth-client";
import { router } from "expo-router";

const LoginScreen = () => {
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      setError(t("signup.errors.missingFields"));
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (signUpError) {
          setError(signUpError.message || t("signup.errors.serverError"));
        } else {
          // Successfully signed up and logged in, redirect
          router.replace("/(tabs)/dashboard");
        }
      } else {
        const signInRes = await authClient.signIn.email({
          email,
          password,
        });
        if (signInRes.error) {
          setError(signInRes.error.message || t("login.invalidEmailPassword"));
        } else {
          // Successfully signed in, redirect
          router.replace("/(tabs)/dashboard");
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github" | "discord") => {
    setError(null);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/(tabs)/dashboard",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to sign in with ${provider}`;
      setError(msg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
      >
        <View className="w-full max-w-md mx-auto py-8">
          {/* Header */}
          <Typography.Heading
            type="h1"
            className="text-3xl font-bold text-foreground text-center mb-2"
          >
            {isSignUp ? t("signup.title") : t("login.title")}
          </Typography.Heading>
          <Typography.Paragraph className="text-muted-foreground text-center mb-8">
            {isSignUp ? t("signup.subtitle") : t("login.subtitle")}
          </Typography.Paragraph>

          {/* Form */}
          <View className="gap-4">
            {isSignUp && (
              <TextField isRequired>
                <Label>{t("signup.usernameLabel")}</Label>
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                  autoCapitalize="words"
                />
              </TextField>
            )}

            <TextField isRequired>
              <Label>{t("login.emailLabel")}</Label>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </TextField>

            <TextField isRequired>
              <Label>{t("login.passwordLabel")}</Label>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </TextField>

            {error && (
              <Typography.Paragraph className="text-danger font-medium text-center">
                {error}
              </Typography.Paragraph>
            )}

            <Button
              variant="primary"
              className="mt-2 py-3"
              onPress={handleEmailAuth}
              isDisabled={loading}
            >
              <Button.Label>
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : isSignUp ? (
                  t("signup.signUpButton")
                ) : (
                  t("login.signInButton")
                )}
              </Button.Label>
            </Button>
          </View>

          {/* Toggle Login/Signup */}
          <View className="flex-row justify-center mt-6">
            <Typography.Paragraph className="text-muted-foreground">
              {isSignUp ? t("signup.hasAccountText") : t("login.noAccountText")}
            </Typography.Paragraph>
            <Button
              variant="ghost"
              className="px-2 py-0 min-h-[30] h-[30]"
              onPress={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
            >
              <Button.Label className="font-semibold text-primary">
                {isSignUp ? t("signup.logInLink") : t("login.signUpLink")}
              </Button.Label>
            </Button>
          </View>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-border" />
            <Typography.Paragraph className="mx-4 text-sm text-muted-foreground uppercase">
              {t("login.orText")}
            </Typography.Paragraph>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          {/* Social Logins */}
          <View className="gap-3">
            <Button
              variant="outline"
              className="flex-row items-center justify-center gap-2 py-3"
              onPress={() => handleSocialSignIn("google")}
              isDisabled={loading}
            >
              <FontAwesome name="google" size={18} className="text-foreground mr-2" />
              <Button.Label>{t("login.signInWithGoogle")}</Button.Label>
            </Button>

            <Button
              variant="outline"
              className="flex-row items-center justify-center gap-2 py-3"
              onPress={() => handleSocialSignIn("github")}
              isDisabled={loading}
            >
              <FontAwesome name="github" size={18} className="text-foreground mr-2" />
              <Button.Label>{t("login.signInWithGitHub")}</Button.Label>
            </Button>

            <Button
              variant="outline"
              className="flex-row items-center justify-center gap-2 py-3"
              onPress={() => handleSocialSignIn("discord")}
              isDisabled={loading}
            >
              <FontAwesome name="gamepad" size={18} className="text-foreground mr-2" />
              <Button.Label>{t("login.signInWithDiscord")}</Button.Label>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
