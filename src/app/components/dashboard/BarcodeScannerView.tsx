import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { Typography, Button } from "heroui-native";
import { useTranslation } from "@/hooks/useTranslation";

type BarcodeScannerViewProps = {
  onScan: (barcode: string) => void;
};

const BarcodeScannerView = ({ onScan }: BarcodeScannerViewProps) => {
  const { t } = useTranslation("dashboard");
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.status === "undetermined") {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950 gap-2 min-h-[300px] rounded-2xl">
        <ActivityIndicator size="small" color="#3b82f6" />
        <Typography.Paragraph className="text-xs text-slate-400 font-medium">
          {t("modalBarcodeScan.detectedWait")}
        </Typography.Paragraph>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-slate-950 gap-4 min-h-[300px] rounded-2xl">
        <View className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full items-center justify-center">
          <Ionicons name="camera-outline" size={24} color="#ef4444" />
        </View>
        <Typography.Paragraph className="text-sm font-semibold text-white text-center">
          {t("modalBarcodeScan.cameraDenied")}
        </Typography.Paragraph>
        <Button
          variant="primary"
          className="bg-blue-600 h-10 px-6 rounded-xl"
          onPress={requestPermission}
        >
          <Button.Label className="text-white text-sm font-semibold">
            {t("error.tryAgain")}
          </Button.Label>
        </Button>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (hasScanned) return;
    setHasScanned(true);
    onScan(data);
  };

  return (
    <View className="relative flex-1 w-full overflow-hidden bg-slate-950 rounded-2xl min-h-[300px]">
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean8", "ean13", "upc_a"],
        }}
      />

      <View style={StyleSheet.absoluteFill} className="bg-black/40 pointer-events-none" />

      <View className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <View className="w-64 h-64 border-2 border-dashed border-white/30 rounded-3xl flex items-center justify-center overflow-hidden relative">
          <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl" />
          <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl" />
          <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl" />
          <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl" />
        </View>
      </View>
    </View>
  );
};

export default BarcodeScannerView;
