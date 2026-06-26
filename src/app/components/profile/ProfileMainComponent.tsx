import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { authClient } from "../../lib/auth-client";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { LanguageAndThemeCard } from "./components/LanguageAndThemeCard";
import { AccountDetails } from "./components/AccountDetails";
import { ChangePassword } from "./components/ChangePassword";
import { useTranslation } from "../../../hooks/useTranslation";

const ProfileMainComponent = () => {
  const { t } = useTranslation("profile");
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending || !user) {
    return <ProfileSkeleton />;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 }}
    >
      <View className="w-full max-w-lg mx-auto gap-6">
        <LanguageAndThemeCard />

        <AccountDetails user={user} />
        <ChangePassword />
        {/* Placeholder cards for components to be implemented next */}
        {/* <BiometricAndGoals user={user} /> */}
        {/* <DeleteAccount /> */}

        <Button variant="danger" className="py-3 mt-4 rounded-xl" onPress={handleSignOut}>
          <Button.Label>{t("signOut")}</Button.Label>
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfileMainComponent;
