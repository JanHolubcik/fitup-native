import React from "react";
import { View, Pressable } from "react-native";
import { Button, TextField, Label, Input, Avatar } from "heroui-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";
import { useUniwind } from "uniwind";
import { useTranslation } from "../../../../../hooks/useTranslation";
import CardUniversal from "../../../common/CardUniversal";

type AccountDetailsFormProps = {
  avatarDisplayUri: string;
  handleChangePicture: () => void;
};

const AccountDetailsForm = ({
  avatarDisplayUri,
  handleChangePicture,
}: AccountDetailsFormProps) => {
  const { t } = useTranslation("profile");
  const { theme } = useUniwind();
  const isDark = theme === "dark";
  const { values, handleChange, handleBlur, handleSubmit, isSubmitting } = useFormikContext<{
    name: string;
    image: string;
  }>();

  return (
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
  );
};

export default AccountDetailsForm;
