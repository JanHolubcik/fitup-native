import { queryOptions } from "@tanstack/react-query";
import { ActivityClass } from "@/types/Types";
import { safeFetch, buildApiUrl } from "./safeFetch";

export const ActivitiesOptions = () =>
  queryOptions({
    queryKey: ["activity"],
    queryFn: () => {
      const fullUrl = buildApiUrl("/api/activity");
      return safeFetch<ActivityClass[]>(
        () =>
          fetch(fullUrl, {
            cache: "no-store",
            credentials: "include",
            method: "GET",
          }),
        "Failed to fetch activities"
      );
    },
    staleTime: 30_000,
    retry: 1,
  });
