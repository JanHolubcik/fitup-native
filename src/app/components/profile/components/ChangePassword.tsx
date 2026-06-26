import React from "react";
import { Separator, Typography, Button, TextField, Label, Input, useToast } from "heroui-native";
import { useUniwind } from "uniwind";
import { Formik } from "formik";
import { useTranslation } from "../../../../hooks/useTranslation";
import { authClient } from "../../../lib/auth-client";
import { CardUniversal } from "../../common/CardUniversal";

export const ChangePassword = () => {
  const { t } = useTranslation("profile");
  const { toast } = useToast();
  const { theme } = useUniwind();
  const isDark = theme === "dark";

  const handlePasswordSubmit = async (
    values: Record<"currentPassword" | "newPassword", string>,
    resetForm: () => void
  ) => {
    try {
      const { error } = await authClient.changePassword({
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.show({ label: error.message || t("toast.error"), variant: "danger" });
      } else {
        toast.show({
          label: t("toast.passwordSuccess"),
          variant: "success",
        });
        resetForm();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toast.error");
      toast.show({ label: msg, variant: "danger" });
    }
  };

  return (
    <CardUniversal>
      <CardUniversal.Header className="pb-2 pt-6 px-6 flex flex-col items-start gap-1">
        <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
          {t("changePassword")}
        </Typography.Heading>
        <Typography.Paragraph className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          {t("changePasswordDesc")}
        </Typography.Paragraph>
      </CardUniversal.Header>
      <Separator className="bg-zinc-200 dark:bg-zinc-800" />
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await handlePasswordSubmit(values, resetForm);
          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <CardUniversal.Body className="px-6 py-6 gap-4">
            <TextField isRequired isDisabled={isSubmitting}>
              <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
                {t("currentPassword")}
              </Label>
              <Input
                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl text-zinc-900 dark:text-white text-sm h-12 focus:border-blue-500"
                value={values.currentPassword}
                onChangeText={handleChange("currentPassword")}
                onBlur={handleBlur("currentPassword")}
                placeholder={t("currentPassword")}
                placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
                secureTextEntry
              />
            </TextField>

            <TextField isRequired isDisabled={isSubmitting}>
              <Label className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider">
                {t("newPassword")}
              </Label>
              <Input
                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-2xl text-zinc-900 dark:text-white text-sm h-12 focus:border-blue-500"
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                placeholder={t("newPassword")}
                placeholderTextColor={isDark ? "#52525b" : "#a1a1aa"}
                secureTextEntry
              />
            </TextField>

            <Button
              className={`bg-blue-600 dark:bg-blue-500 py-3 rounded-2xl items-center justify-center mt-3 h-12 shadow-md shadow-blue-500/10 active:opacity-90 ${
                isSubmitting ? "opacity-60" : ""
              }`}
              onPress={() => handleSubmit()}
              isDisabled={isSubmitting || !values.currentPassword || !values.newPassword}
            >
              <Button.Label className="text-white font-bold text-sm tracking-wide">
                {isSubmitting
                  ? t("toast.passwordPending")
                  : t("updatePassword")}
              </Button.Label>
            </Button>
          </CardUniversal.Body>
        )}
      </Formik>
    </CardUniversal>
  );
};
