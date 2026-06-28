import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useToast } from "heroui-native";
import { authClient } from "../../../../../lib/auth-client";
import { uploadImage } from "../../../../../lib/api-client";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type UseAccountDetailsProps = {
  user: User;
};

const useAccountDetails = ({ user }: UseAccountDetailsProps) => {
  const { t } = useTranslation("profile");
  const { toast } = useToast();
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const uploadImageMutation = useMutation({
    mutationFn: uploadImage,
  });

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

      if (!result.canceled && result.assets?.[0]?.uri) {
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

      if (!result.canceled && result.assets?.[0]?.uri) {
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
        await authClient.getSession({ fetchOptions: { cache: "no-cache" } });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toast.error");
      toast.show({ label: msg, variant: "danger" });
    }
  };

  const avatarDisplayUri = localImageUri || user?.image || "";

  return {
    localImageUri,
    avatarDisplayUri,
    handleChangePicture,
    handleAccountSubmit,
    isUploading: uploadImageMutation.isPending,
  };
};

export default useAccountDetails;
