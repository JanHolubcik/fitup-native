import React, { useState } from "react";
import { View, Alert, Pressable } from "react-native";
import {
  Separator,
  Typography,
  Button,
  TextField,
  Label,
  Input,
  Avatar,
  useToast,
} from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { useUniwind } from "uniwind";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "../../../../hooks/useTranslation";
import { authClient } from "../../../lib/auth-client";
import { uploadImage } from "../../../lib/api-client";
import { CardUniversal } from "../../common/CardUniversal";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type AccountDetailsProps = {
  user: User;
};

export const AccountDetails = ({ user }: AccountDetailsProps) => {
  const { t } = useTranslation("profile");
  const { toast } = useToast();
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        toast.show({ label: t("toast.permissionDenied"), variant: "danger" });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLocalImageUri(result.assets[0].uri);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toast.uploadError");
      toast.show({ label: msg, variant: "danger" });
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        toast.show({ label: t("toast.permissionDenied"), variant: "danger" });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLocalImageUri(result.assets[0].uri);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toast.uploadError");
      toast.show({ label: msg, variant: "danger" });
    }
  };

  const handleChangePicture = () => {
    Alert.alert(t("changePicture"), t("chooseOption"), [
      {
        text: t("chooseFromGallery"),
        onPress: pickImage,
      },
      {
        text: t("takePhoto"),
        onPress: takePhoto,
      },
      {
        text: t("cancel"),
        style: "cancel",
      },
    ]);
  };

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
  });

  const handleAccountSubmit = async (values: { name: string; image: string }) => {
    try {
      let finalImageUrl = values.image;

      if (localImageUri) {
        try {
          finalImageUrl = await uploadImageMutation.mutateAsync(localImageUri);
        } catch (uploadErr) {
          const msg = uploadErr instanceof Error ? uploadErr.message : t("toast.uploadError");
          toast.show({ label: msg, variant: "danger" });
          return;
        }
      }

      const { error } = await authClient.updateUser({
        name: values.name,
        image: finalImageUrl || undefined,
      });

      if (error) {
        toast.show({ label: error.message || t("toast.error"), variant: "danger" });
      } else {
        toast.show({ label: t("toast.success"), variant: "success" });

        setLocalImageUri(finalImageUrl);
        void authClient.getSession({ fetchOptions: { cache: "no-cache" } });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toast.error");
      toast.show({ label: msg, variant: "danger" });
    }
  };

  const avatarDisplayUri = localImageUri || user?.image || "";

  return (
    <CardUniversal>
      <CardUniversal.Header className="pb-2 pt-6 px-6 flex flex-col items-start gap-1">
        <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
          {t("accountDetails")}
        </Typography.Heading>
        <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          {t("accountDetailsDesc")}
        </Typography.Paragraph>
      </CardUniversal.Header>
      <Separator className="bg-zinc-200 dark:bg-zinc-800" />
      <Formik
        initialValues={{
          name: user?.name || "",
          image: user?.image || "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await handleAccountSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <CardUniversal.Body className="px-6 py-6 gap-6">
            <View className="items-center py-2">
              <Pressable
                onPress={handleChangePicture}
                disabled={isSubmitting}
                className="relative active:scale-95 transition-transform"
              >
                <View className="relative">
                  <Avatar
                    size="lg"
                    className="w-24 h-24 rounded-full border-4 border-zinc-100 dark:border-zinc-800 shadow-md"
                  >
                    {avatarDisplayUri ? <Avatar.Image source={{ uri: avatarDisplayUri }} /> : null}
                    <Avatar.Fallback className="text-2xl font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {values.name ? values.name.substring(0, 2).toUpperCase() : "?"}
                    </Avatar.Fallback>
                  </Avatar>
                  <View className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-500 p-1 rounded-full border-2 border-white dark:border-zinc-900 shadow-md">
                    <Ionicons name="camera" size={16} color="white" />
                  </View>
                </View>
              </Pressable>
            </View>

            <View className="gap-4">
              <TextField isRequired isDisabled={isSubmitting}>
                <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
                  {t("displayName")}
                </Label>
                <Input
                  className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl text-zinc-900 dark:text-white text-sm h-12 focus:border-blue-500"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  placeholder={t("displayName")}
                  placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
                />
              </TextField>

              <Button
                className={`bg-blue-600 dark:bg-blue-500 py-3 rounded-2xl items-center justify-center mt-3 h-12 shadow-md shadow-blue-500/10 active:opacity-90 ${
                  isSubmitting ? "opacity-60" : ""
                }`}
                onPress={() => handleSubmit()}
                isDisabled={isSubmitting}
              >
                <Button.Label className="text-white font-bold text-sm tracking-wide">
                  {isSubmitting ? t("toast.pending") : t("saveChanges")}
                </Button.Label>
              </Button>
            </View>
          </CardUniversal.Body>
        )}
      </Formik>
    </CardUniversal>
  );
}
