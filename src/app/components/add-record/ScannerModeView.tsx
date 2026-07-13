import React from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "heroui-native";
import BarcodeScannerView from "../dashboard/BarcodeScannerView";

type ScannerModeViewProps = {
  onSelectModeChange: (mode: "select" | "manual" | "scanner" | "ai") => void;
  t: (key: string) => string;
  isDark: boolean;
  isRecordModalOpen: boolean;
  isNotFoundOpen: boolean;
  handleScan: (barcode: string) => void;
  isScanningProduct: boolean;
};

const ScannerModeView = ({
  onSelectModeChange,
  t,
  isDark,
  isRecordModalOpen,
  isNotFoundOpen,
  handleScan,
  isScanningProduct,
}: ScannerModeViewProps) => {
  return (
    <View className="flex-1 gap-4">
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => onSelectModeChange("select")}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl items-center justify-center active:bg-zinc-50 dark:active:bg-zinc-850"
          style={{ borderCurve: "continuous" }}
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? "#ffffff" : "#000000"} />
        </Pressable>
        <View className="flex-col">
          <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
            {t("modalBarcodeScan.title")}
          </Typography.Heading>
        </View>
      </View>

      <View className="relative w-full aspect-square max-w-[340px] self-center overflow-hidden rounded-2xl dark:border-zinc-800 bg-slate-950 shadow-inner flex items-center justify-center">
        {!isRecordModalOpen && !isNotFoundOpen && (
          <BarcodeScannerView onScan={handleScan} />
        )}
      </View>

      <View className="flex flex-col items-center text-center gap-3 w-full max-w-[340px] self-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl">
        {isScanningProduct ? (
          <>
            <Typography.Paragraph className="text-sm font-semibold text-zinc-850 dark:text-white text-center">
              {t("modalBarcodeScan.detectedWait")}
            </Typography.Paragraph>
            <ActivityIndicator size="small" color="#3b82f6" style={{ marginTop: 8 }} />
          </>
        ) : (
          <View className="space-y-1">
            <Typography.Paragraph className="text-sm font-semibold text-zinc-850 dark:text-white text-center">
              {t("modalBarcodeScan.autoFetch")}
            </Typography.Paragraph>
          </View>
        )}
      </View>
    </View>
  );
};

export default ScannerModeView;
