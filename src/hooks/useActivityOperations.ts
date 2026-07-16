import { useCallback, useMemo } from "react";
import { format, subDays } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "heroui-native";

import { useCurrentDate } from "./useDashboardState";
import { LastMonthSavedActivities } from "../lib/queriesOptions/LastMonthSavedActivitiesOptions";
import { SavedActivitiesOptions } from "../lib/queriesOptions/SavedActivitiesOptions";
import { authClient } from "../lib/auth-client";
import { LoggedActivityType } from "../types/Types";
import { useTranslation } from "./useTranslation";

type PromiseToastMessages = {
  pending: string;
  success: string;
  error: string;
};

const useActivityOperations = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const queryClient = useQueryClient();
  const { t } = useTranslation("dashboard");
  const { toast } = useToast();

  const saveActivityMutation = useMutation(SavedActivitiesOptions());

  const [currentDate] = useCurrentDate();
  const dateString = currentDate;

  const dateTo = format(new Date(), "yyyy-MM-dd");
  const dateFrom = format(subDays(new Date(), 30), "yyyy-MM-dd");

  const { data: savedActivityMonth = {} } = useQuery(LastMonthSavedActivities(dateFrom, dateTo));
  const savedActivities = useMemo(() => {
    return savedActivityMonth[dateString] ?? [];
  }, [savedActivityMonth, dateString]);

  const toastPromise = useCallback(
    async <T>(promise: Promise<T>, messages: PromiseToastMessages) => {
      try {
        await promise;
        toast.show({ label: messages.success, variant: "success" });
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : messages.error;
        toast.show({ label: errMsg, variant: "danger" });
      }
    },
    [toast]
  );

  const saveActivitiesToDB = useCallback(
    async (activitiesToSave?: LoggedActivityType[], isLastItem: boolean = false) => {
      if (!user?.id) return;

      const activities = activitiesToSave || savedActivities;

      if (activities.length === 0 && !isLastItem) return;

      try {
        await saveActivityMutation.mutateAsync({
          date: dateString,
          savedActivity: activities,
          userID: user.id,
        });
      } catch (err) {
        console.error("Error saving activity:", err);
        throw err;
      }
    },
    [user, savedActivities, dateString, saveActivityMutation]
  );

  const addActivityRecord = useCallback(
    async (payload: { activity: string; durationMinutes: number; caloriesBurned: number }) => {
      const uniqueId = Date.now();

      const newActivityRecord: LoggedActivityType = {
        id: uniqueId,
        activity: payload.activity,
        durationMinutes: payload.durationMinutes,
        caloriesBurned: payload.caloriesBurned,
      };

      const queryKey = LastMonthSavedActivities(dateFrom, dateTo).queryKey;
      queryClient.setQueryData(
        queryKey,
        (oldData: Record<string, LoggedActivityType[]> | undefined) => {
          const data = oldData ? { ...oldData } : {};
          data[dateString] = [...(data[dateString] ?? []), newActivityRecord];
          return data;
        }
      );

      const updatedActivities = [...savedActivities, newActivityRecord];

      const res = saveActivitiesToDB(updatedActivities);

      await toastPromise(res, {
        pending: t("toast.pending"),
        success: t("toast.activitySuccess"),
        error: t("toast.activityError"),
      });
    },
    [
      savedActivities,
      dateString,
      dateFrom,
      dateTo,
      queryClient,
      saveActivitiesToDB,
      t,
      toastPromise,
    ]
  );

  const updateActivity = useCallback(
    async (updatedActivity: LoggedActivityType) => {
      const queryKey = LastMonthSavedActivities(dateFrom, dateTo).queryKey;
      queryClient.setQueryData(
        queryKey,
        (oldData: Record<string, LoggedActivityType[]> | undefined) => {
          const data = oldData ? { ...oldData } : {};
          if (!data[dateString]) {
            data[dateString] = [];
          }
          data[dateString] = data[dateString].map((act) =>
            act.id === updatedActivity.id ? updatedActivity : act
          );
          return data;
        }
      );

      const updatedActivities = savedActivities.map((act) =>
        act.id === updatedActivity.id ? updatedActivity : act
      );

      const res = saveActivitiesToDB(updatedActivities);

      await toastPromise(res, {
        pending: t("toast.pending"),
        success: t("toast.updated"),
        error: t("toast.error"),
      });
    },
    [
      dateString,
      dateFrom,
      dateTo,
      queryClient,
      savedActivities,
      saveActivitiesToDB,
      t,
      toastPromise,
    ]
  );

  const removeFromSavedActivity = useCallback(
    async (id: string | number) => {
      const queryKey = LastMonthSavedActivities(dateFrom, dateTo).queryKey;
      queryClient.setQueryData(
        queryKey,
        (oldData: Record<string, LoggedActivityType[]> | undefined) => {
          const data = oldData ? { ...oldData } : {};
          if (!data[dateString]) {
            data[dateString] = [];
          }
          data[dateString] = data[dateString].filter((act) => act.id !== id);
          return data;
        }
      );

      const updatedActivities = savedActivities.filter((a) => a.id !== id);
      const isLastItem = updatedActivities.length === 0;

      const res = saveActivitiesToDB(updatedActivities, isLastItem);

      await toastPromise(res, {
        pending: t("toast.pending"),
        success: t("toast.activityRemoved"),
        error: t("toast.error"),
      });
    },
    [
      dateString,
      dateFrom,
      dateTo,
      queryClient,
      savedActivities,
      saveActivitiesToDB,
      t,
      toastPromise,
    ]
  );

  return {
    savedActivities,
    addActivityRecord,
    removeFromSavedActivity,
    updateActivity,
  };
};

export default useActivityOperations;
