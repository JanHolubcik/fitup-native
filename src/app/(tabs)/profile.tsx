import { View } from "react-native";

import { useTranslation } from "../../hooks/useTranslation";
import ProfileMainComponent from "../components/profile/ProfileMainComponent";
import MaterialTopTabs from "../components/common/MaterialTopTabs";

const ProfileTab = () => {
  const { t } = useTranslation("navbar");

  return (
    <>
      <MaterialTopTabs.Screen options={{ title: t("profile") }} />
      <View className="flex-grow flex-1 bg-zinc-50 dark:bg-zinc-950">
        <ProfileMainComponent />
      </View>
    </>
  );
};

export default ProfileTab;
