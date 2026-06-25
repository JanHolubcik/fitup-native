import { Tabs } from "expo-router";
import type { JSX } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import ProfileMainComponent from "../components/profile/ProfileMainComponent";

export default function ProfileTab(): JSX.Element {
  const { t } = useTranslation("navbar");

  return (
    <>
      <Tabs.Screen options={{ title: t("profile") }} />
      <ProfileMainComponent />
    </>
  );
}
