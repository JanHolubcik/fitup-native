import { Tabs } from "expo-router";
import { View, Platform } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import FoodSearch from "../components/dashboard/FoodSearch";

const DashboardTab = () => {
  const { t } = useTranslation("navbar");

  const paddingTop = Platform.OS === "ios" ? 60 : 40;

  return (
    <>
      <Tabs.Screen options={{ title: t("dashboard") }} />
      <View className="flex-1 bg-background px-4 pb-4" style={{ paddingTop }}>
        <FoodSearch />
      </View>
    </>
  );
};

export default DashboardTab;

