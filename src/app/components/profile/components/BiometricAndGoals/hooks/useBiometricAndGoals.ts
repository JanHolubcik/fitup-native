import { useTranslation } from "../../../../../../hooks/useTranslation";
import { useToast } from "heroui-native";
import { authClient } from "../../../../../lib/auth-client";

const useBiometricAndGoals = () => {
  const { t } = useTranslation("profile");
  const { toast } = useToast();

  const handleBiometricsSubmit = async (values: {
    weight: string;
    weightGoal: string;
    height: string;
    activityLevel: string;
    goal: string;
  }) => {
    try {
      const { error } = await authClient.updateUser({
        weight: values.weight ? Number(values.weight) : null,
        weightGoal: values.weightGoal ? Number(values.weightGoal) : null,
        height: values.height ? Number(values.height) : null,
        activityLevel: values.activityLevel,
        goal: values.goal,
      });

      if (error) {
        toast.show({ label: error.message || t("toast.error"), variant: "danger" });
      } else {
        toast.show({ label: t("toast.biometricSuccess"), variant: "success" });
        await authClient.getSession({ fetchOptions: { cache: "no-cache" } });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("toast.error");
      toast.show({ label: msg, variant: "danger" });
    }
  };

  return {
    handleBiometricsSubmit,
  };
};

export default useBiometricAndGoals;
