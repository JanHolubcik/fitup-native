import React from "react";
import { Separator, Typography } from "heroui-native";
import { Formik } from "formik";

import { authClient } from "@/app/lib/auth-client";
import useBiometricAndGoals from "./hooks/useBiometricAndGoals";
import BiometricAndGoalsForm from "./BiometricAndGoalsForm";
import CardUniversal from "@/app/components/common/CardUniversal";
import { useTranslation } from "react-i18next";

type User = typeof authClient.$Infer.Session.user;

type BiometricAndGoalsProps = {
  user: User;
};

const BiometricAndGoals = ({ user }: BiometricAndGoalsProps) => {
  const { t } = useTranslation("profile");
  const { handleBiometricsSubmit } = useBiometricAndGoals();

  return (
    <CardUniversal>
      <CardUniversal.Header className="pb-2 pt-6 px-6 flex flex-col items-start gap-1">
        <Typography.Heading type="h3" className="font-bold text-zinc-900 dark:text-white">
          {t("biometricsAndGoals")}
        </Typography.Heading>
      </CardUniversal.Header>
      <Separator className="bg-zinc-200 dark:bg-zinc-800" />

      <Formik
        initialValues={{
          weight: String(user.weight),
          weightGoal: String(user.weightGoal),
          height: String(user.height),
          activityLevel: user.activityLevel || "sedentary",
          goal: user.goal || "loseWeight",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await handleBiometricsSubmit(values);
          setSubmitting(false);
        }}
      >
        <BiometricAndGoalsForm />
      </Formik>
    </CardUniversal>
  );
};

export default BiometricAndGoals;
