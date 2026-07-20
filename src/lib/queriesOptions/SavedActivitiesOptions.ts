import { LoggedActivityType } from "@/types/Types";
import { safeFetch, buildApiUrl } from "./safeFetch";

export const SavedActivitiesOptions = () => ({
  mutationFn: ({
    date,
    savedActivity,
    userID,
  }: {
    date: string;
    savedActivity: LoggedActivityType[];
    userID: string;
  }) => {
    const fullUrl = buildApiUrl("/api/savedActivity");
    return safeFetch<string>(
      () =>
        fetch(fullUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            activities: savedActivity,
            userID,
          }),
          credentials: "include",
        }),
      "Failed to save activities"
    );
  },
});
