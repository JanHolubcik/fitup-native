import React, { useState } from "react";
import { View } from "react-native";
import { Separator, Typography, Button, useToast } from "heroui-native";
import { useRouter } from "expo-router";
import { useTranslation } from "../../../../hooks/useTranslation";
import { authClient } from "../../../lib/auth-client";
import CardUniversal from "../../common/CardUniversal";
import YesNoDialog from "../../common/YesNoDialog";

const DeleteAccount = () => {
  const { t } = useTranslation("profile");
  const router = useRouter();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await authClient.deleteUser();
      if (error) {
        toast.show({ label: error.message || t("toast.deleteError"), variant: "danger" });
        setIsDeleting(false);
      } else {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.show({ label: t("toast.deleteSuccess"), variant: "success" });
              setIsModalOpen(false);
              router.replace("/login");
            },
            onError: (ctx) => {
              console.error("Sign out error after account deletion:", ctx.error);
              toast.show({ label: t("toast.deleteSuccess"), variant: "success" });
              setIsModalOpen(false);
              router.replace("/login");
            },
          },
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toast.deleteError");
      toast.show({ label: msg, variant: "danger" });
      setIsDeleting(false);
    }
  };

  return (
    <>
      <CardUniversal className="border-red-200 dark:border-red-950 bg-red-50/50 dark:bg-red-950/10">
        <CardUniversal.Header className="pb-2 pt-6 px-6 flex flex-col items-start gap-1">
          <Typography.Heading type="h3" className="font-bold text-red-600 dark:text-red-500">
            {t("dangerZone")}
          </Typography.Heading>
        </CardUniversal.Header>
        <Separator className="bg-red-200 dark:bg-red-950" />
        <CardUniversal.Body className="px-6 py-6 gap-4">
          <View className="flex-col gap-4">
            <View>
              <Typography.Paragraph className="text-sm font-bold text-zinc-900 dark:text-white">
                {t("deleteAccount")}
              </Typography.Paragraph>
              <Typography.Paragraph className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                {t("deleteAccountNotice")}
              </Typography.Paragraph>
            </View>
            <Button
              variant="danger"
              className="py-3 rounded-xl h-11"
              onPress={() => setIsModalOpen(true)}
            >
              <Button.Label className="text-white font-bold text-sm">
                {t("deleteAccount")}
              </Button.Label>
            </Button>
          </View>
        </CardUniversal.Body>
      </CardUniversal>

      <YesNoDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleDeleteAccount}
        title={t("deleteAccount")}
        description={t("deleteAccountConfirm")}
        confirmText={t("deleteAccount")}
        cancelText={t("cancel")}
        confirmColor="danger"
        isLoading={isDeleting}
      />
    </>
  );
};

export default DeleteAccount;
