import { SavedFoodClass } from "@/types/Types";
import { queryOptions } from "@tanstack/react-query";
import { safeFetch, buildApiUrl } from "./safeFetch";

export const LastWeekFoodOptions = (dateFrom: string, dateTo: string) =>
  queryOptions({
    queryKey: ["lastWeekFood", dateTo, dateFrom] as const,
    queryFn: ({ queryKey }) => {
      const [, dateToVal, dateFromVal] = queryKey;
      const fullUrl = buildApiUrl(
        `/api/lastWeekFood?dateFrom=${dateFromVal}&dateTo=${dateToVal}`
      );
      return safeFetch<SavedFoodClass[]>(
        () =>
          fetch(fullUrl, { cache: "no-store", credentials: "include" }),
        "Failed to fetch food"
      );
    },
    staleTime: 1000 * 60 * 15,
    retry: 0,
  });
