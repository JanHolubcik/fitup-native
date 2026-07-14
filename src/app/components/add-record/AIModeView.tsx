import React from "react";
import { View, Pressable, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Typography, Button } from "heroui-native";
import * as ImagePicker from "expo-image-picker";

type AIModeViewProps = {
  onSelectModeChange: (mode: "select" | "manual" | "scanner" | "ai") => void;
  t: (key: string) => string;
  isDark: boolean;
  onAnalyze: (base64: string, localUri: string) => void;
  isAnalyzing: boolean;
};

const AIModeView = ({ onSelectModeChange, t, isDark, onAnalyze, isAnalyzing }: AIModeViewProps) => {
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [libraryPermission, requestLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  const handleReset = () => {
    setImageUri(null);
  };

  const handleTakePhoto = async () => {
    let permission = cameraPermission;
    if (!permission || !permission.granted) {
      permission = await requestCameraPermission();
    }
    if (!permission.granted) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]?.base64) {
        setImageUri(result.assets[0].uri);
        onAnalyze(result.assets[0].base64, result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const handlePickImage = async () => {
    let permission = libraryPermission;
    if (!permission || !permission.granted) {
      permission = await requestLibraryPermission();
    }
    if (!permission.granted) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]?.base64) {
        setImageUri(result.assets[0].uri);
        onAnalyze(result.assets[0].base64, result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <View className="flex-1 gap-6">
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => {
            if (imageUri) {
              handleReset();
            } else {
              onSelectModeChange("select");
            }
          }}
          className="w-10 h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl items-center justify-center active:bg-zinc-50 dark:active:bg-zinc-850"
          style={{ borderCurve: "continuous" }}
          disabled={isAnalyzing}
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? "#ffffff" : "#000000"} />
        </Pressable>
        <View className="flex-col">
          <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
            {t("aiFoodScan.title")}
          </Typography.Heading>
        </View>
      </View>

      {imageUri ? (
        <View className="flex-grow flex-1 gap-6 items-center justify-center">
          <View className="relative w-full aspect-square max-w-[340px] self-center overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-slate-950 shadow-inner flex items-center justify-center">
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            {isAnalyzing && (
              <View className="absolute inset-0 bg-black/60 items-center justify-center gap-3">
                <ActivityIndicator size="large" color="#a855f7" />
                <Typography.Paragraph className="text-sm font-bold text-white text-center">
                  {t("takePictureModal.analyzing")}
                </Typography.Paragraph>
              </View>
            )}
          </View>

          {!isAnalyzing && (
            <View className="w-full max-w-[340px] gap-3">
              <Button
                variant="primary"
                className="bg-purple-600 h-12 rounded-xl flex-row justify-center items-center gap-2"
                onPress={handleReset}
              >
                <Ionicons name="camera-reverse" size={18} color="#ffffff" />
                <Button.Label className="text-white text-sm font-bold">
                  {t("takePictureModal.takeAnother")}
                </Button.Label>
              </Button>
            </View>
          )}
        </View>
      ) : (
        <View className="flex-1 gap-4">
          <View
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl items-center justify-center gap-6"
            style={{ borderCurve: "continuous" }}
          >
            <View className="w-16 h-16 bg-purple-50 dark:bg-purple-950/20 rounded-2xl items-center justify-center">
              <Ionicons name="sparkles-outline" size={32} color="#a855f7" />
            </View>

            <View className="items-center gap-1.5">
              <Typography.Heading
                type="h4"
                className="font-bold text-zinc-900 dark:text-white text-center"
              >
                {t("aiFoodScan.title")}
              </Typography.Heading>
              <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 text-center px-4">
                {t("aiFoodScan.subtitle")}
              </Typography.Paragraph>
            </View>

            <View className="w-full gap-3 mt-2">
              <Button
                variant="primary"
                className="bg-purple-600 h-12 rounded-xl flex-row justify-center items-center gap-2"
                onPress={handleTakePhoto}
              >
                <Ionicons name="camera" size={18} color="#ffffff" />
                <Button.Label className="text-white text-sm font-bold">
                  {t("aiFoodScan.takePhoto")}
                </Button.Label>
              </Button>

              <Button
                variant="outline"
                className="border border-zinc-200 dark:border-zinc-800 h-12 rounded-xl flex-row justify-center items-center gap-2"
                onPress={handlePickImage}
              >
                <Ionicons name="images" size={18} color={isDark ? "#ffffff" : "#000000"} />
                <Button.Label className="text-zinc-900 dark:text-white text-sm font-bold">
                  {t("aiFoodScan.chooseGallery")}
                </Button.Label>
              </Button>
            </View>
          </View>
          <View
            className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-150 dark:border-zinc-900/50 p-5 rounded-3xl gap-1.5"
            style={{ borderCurve: "continuous" }}
          >
            <Typography.Paragraph className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {t("modalScanFood.disclaimerTitle")}
            </Typography.Paragraph>
            <Typography.Paragraph className="text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
              {t("modalScanFood.disclaimerText")}
            </Typography.Paragraph>
          </View>
        </View>
      )}
    </View>
  );
};

export default AIModeView;
