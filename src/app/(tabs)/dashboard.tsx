import { Tabs } from "expo-router";
import { View, Platform, ScrollView } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import DateSwitcher from "../components/dashboard/DateSwitcher";
import CalorieCard from "../components/dashboard/CalorieCard";
import TodayMacros from "../components/dashboard/TodayMacros";
import AccordionTimeFrame from "../components/dashboard/AccordionTimeFrame";
import ModalFindFood from "../components/dashboard/ModalFindFood";
import { useIsSearchOpen, useActiveTimeFrame } from "@/hooks/useDashboardState";

const DashboardTab = () => {
  const { t } = useTranslation("navbar");
  const paddingTop = Platform.OS === "ios" ? 60 : 40;
  const [isSearchOpen, setIsSearchOpen] = useIsSearchOpen();
  const [activeTimeFrame] = useActiveTimeFrame();

  return (
    <>
      <Tabs.Screen options={{ title: t("dashboard") }} />
      <View className="flex-1 bg-zinc-50 dark:bg-zinc-950 px-4" style={{ paddingTop }}>
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ gap: 16, paddingTop: 8, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <DateSwitcher />
          
          <View className="flex-col md:flex-row gap-4 w-full">
            <CalorieCard />
            <TodayMacros />
          </View>
          
          <AccordionTimeFrame />
        </ScrollView>
      </View>

      <ModalFindFood isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} timeOfDay={activeTimeFrame} />
    </>
  );
};

export default DashboardTab;
