import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { authClient } from "../../lib/auth-client";
import ProfileSkeleton from "./components/ProfileSkeleton";
import LanguageAndThemeCard from "./components/LanguageAndThemeCard";
import { AccountDetails } from "./components/AccountDetails";
import ChangePassword from "./components/ChangePassword";
import { useTranslation } from "../../../hooks/useTranslation";
import BiometricAndGoals from "./components/BiometricAndGoals";
import DeleteAccount from "./components/DeleteAccount";
import YesNoDialog from "../common/YesNoDialog";

const ProfileMainComponent = () => {
  const { t } = useTranslation("profile");
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isPending || !user) {
    return <ProfileSkeleton />;
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      setIsSignOutModalOpen(false);
      router.replace("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 }}
      >
        <View className="w-full max-w-lg mx-auto gap-6">
          <LanguageAndThemeCard />

          <AccountDetails user={user} />
          <BiometricAndGoals user={user} />
          <ChangePassword />
          <DeleteAccount />

          <Button
            variant="primary"
            className="py-3 mt-4 rounded-xl"
            onPress={() => setIsSignOutModalOpen(true)}
          >
            <Button.Label>{t("signOut")}</Button.Label>
          </Button>
        </View>
      </ScrollView>

      <YesNoDialog
        isOpen={isSignOutModalOpen}
        onOpenChange={setIsSignOutModalOpen}
        onConfirm={handleSignOut}
        title={t("signOut")}
        description={t("signOutConfirmDesc")}
        confirmText={t("signOut")}
        cancelText={t("cancel")}
        isLoading={isSigningOut}
        confirmColor="primary"
      />
    </>
  );
};

export default ProfileMainComponent;
