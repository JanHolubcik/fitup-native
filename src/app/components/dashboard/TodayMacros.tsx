import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import useTodayMacros from "@/hooks/useTodayMacros";
import CardUniversal from "../common/CardUniversal";
import MacrosProgressBarDashboard from "./MacrosProgressBarDashboard";
import { MACRO_TAILWIND_THEME, MacroArray } from "@/utils/MacrosHelper";

const TodayMacros = () => {
  const { recommendedMacros, calculatedMacros } = useTodayMacros();
  const { t } = useTranslation("dashboard");

  return (
    <CardUniversal className="w-full flex-1 border-zinc-200 dark:border-zinc-800 shadow-md">
      <CardUniversal.Body className="p-4 gap-2">
        {MacroArray.map((macro) => {
          const currentVal = calculatedMacros[macro as keyof typeof calculatedMacros] ?? 0;
          const targetVal = recommendedMacros[macro as keyof typeof recommendedMacros] ?? 0;
          
          return (
            <MacrosProgressBarDashboard
              key={macro}
              label={t(`macros.${macro}`)}
              current={currentVal}
              target={targetVal}
              unit={macro === "calories" ? t("todayMacros.kcal") : t("todayMacros.g")}
              colorName={MACRO_TAILWIND_THEME[macro].color}
            />
          );
        })}
      </CardUniversal.Body>
    </CardUniversal>
  );
};

export default TodayMacros;
