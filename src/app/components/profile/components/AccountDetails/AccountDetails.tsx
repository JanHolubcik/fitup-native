import React from "react";
import { Separator, Typography } from "heroui-native";
import { Formik } from "formik";
import { useTranslation } from "../../../../../hooks/useTranslation";
import CardUniversal from "../../../common/CardUniversal";
import useAccountDetails from "./hooks/useAccountDetails";
import { authClient } from "@/lib/auth-client";
import AccountDetailsForm from "./AccountDetailsForm";

type User = typeof authClient.$Infer.Session.user;

type AccountDetailsProps = {
  user: User;
};

const AccountDetails = ({ user }: AccountDetailsProps) => {
  const { t } = useTranslation("profile");

  const { avatarDisplayUri, handleChangePicture, handleAccountSubmit } = useAccountDetails({
    user,
  });

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
        <AccountDetailsForm
          avatarDisplayUri={avatarDisplayUri}
          handleChangePicture={handleChangePicture}
        />
      </Formik>
    </CardUniversal>
  );
};

export default AccountDetails;
