import React, { ReactNode } from "react";
import { View } from "react-native";
import { Button, Typography } from "heroui-native";
import { useTranslation } from "@/hooks/useTranslation";
import CardUniversal from "./CardUniversal";

type CardErrorProps = {
  title: string;
  description: string;
  icon: ReactNode;
  refetch: () => void | Promise<void>;
  className?: string;
};

const CardError = ({
  title,
  description,
  icon,
  refetch,
  className = "",
}: CardErrorProps) => {
  const { t } = useTranslation("dashboard");

  return (
    <CardUniversal
      className={`w-full bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-500/20 p-5 gap-4 items-center justify-center ${className}`}
      style={{ borderCurve: "continuous" }}
    >
      <View className="items-center gap-3">
        <View className="text-red-500 dark:text-red-400">
          {icon}
        </View>
        <View className="items-center gap-1">
          <Typography.Heading type="h4" className="text-lg font-bold text-red-700 dark:text-red-400 text-center">
            {title}
          </Typography.Heading>
          <Typography.Paragraph className="text-xs font-normal text-red-600/80 dark:text-red-400/70 text-center max-w-[280px]">
            {description}
          </Typography.Paragraph>
        </View>
      </View>
      <Button
        className="px-4 h-9 rounded-xl mt-1 bg-red-100 active:bg-red-200 dark:bg-red-500/20 justify-center items-center"
        onPress={refetch}
      >
        <Button.Label className="text-red-700 dark:text-red-300 font-bold text-xs">
          {t("error.tryAgain")}
        </Button.Label>
      </Button>
    </CardUniversal>
  );
};

export default CardError;
