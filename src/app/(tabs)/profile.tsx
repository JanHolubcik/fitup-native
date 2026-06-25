import { Tabs, useRouter } from "expo-router";
import { Typography, Avatar, Button } from "heroui-native";
import type { JSX } from "react";
import { ScrollView, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { authClient } from "../lib/auth-client";

export default function ProfileTab(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <Tabs.Screen options={{ title: t("navbar.profile") }} />
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
        {session?.user && (
          <View className="items-center bg-card p-6 rounded-2xl mb-6 shadow-sm border border-border">
            <Avatar size="lg" color="accent" className="mb-4">
              {session.user.image ? <Avatar.Image source={{ uri: session.user.image }} /> : null}
              <Avatar.Fallback>{userInitials}</Avatar.Fallback>
            </Avatar>
            <Typography.Heading type="h3" className="font-bold text-foreground">
              {session.user.name}
            </Typography.Heading>
            <Typography.Paragraph className="text-muted-foreground text-sm mt-1">
              {session.user.email}
            </Typography.Paragraph>
          </View>
        )}

        <View className="gap-6">
          <View className="gap-4">
            <ThemeSwitcher />
          </View>

          <Button variant="danger" className="py-3 mt-4" onPress={handleSignOut}>
            <Button.Label>{t("profile.signOut")}</Button.Label>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}
