import { Tabs } from "expo-router";
import { Typography } from "heroui-native";
import { ScrollView } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";

const DashboardTab = () => {
  const { t } = useTranslation("navbar");

  return (
    <>
      <Tabs.Screen options={{ title: t("dashboard") }} />
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
        <Typography.Paragraph>{t("dashboard")}</Typography.Paragraph>
      </ScrollView>
    </>
  );
};

export default DashboardTab;
