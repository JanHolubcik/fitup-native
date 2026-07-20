import { queryOptions } from "@tanstack/react-query";
import { LoggedActivityType } from "@/types/Types";
import { safeFetch, buildApiUrl } from "./safeFetch";

export const LastMonthSavedActivities = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastMonthSavedActivity", dateTo, dateFrom] as const,
    queryFn: () => {
      const fullUrl = buildApiUrl(
        `/api/lastMonthSavedActivity?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      return safeFetch<Record<string, LoggedActivityType[]>>(
        () =>
          fetch(fullUrl, { cache: "no-store", credentials: "include" }),
        "Failed to fetch last month saved activities"
      );
    },
    staleTime: 600000,
    retry: 0,
    refetchOnWindowFocus: false,
  });
