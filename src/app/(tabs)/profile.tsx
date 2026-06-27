import { Tabs } from "expo-router";
import { useTranslation } from "../../hooks/useTranslation";
import ProfileMainComponent from "../components/profile/ProfileMainComponent";

const ProfileTab = () => {
  const { t } = useTranslation("navbar");

  return (
    <>
      <Tabs.Screen options={{ title: t("profile") }} />
      <ProfileMainComponent />
    </>
  );
};

export default ProfileTab;
