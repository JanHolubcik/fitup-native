import { FoodType } from "@/types/Types";
import { queryOptions } from "@tanstack/react-query";
import { safeFetch, buildApiUrl } from "./safeFetch";

export const DailyIntakeOptions = (userId: string, date: string) =>
  queryOptions({
    queryKey: ["savedFood", userId, date],
    queryFn: () => {
      const fullUrl = buildApiUrl(`/api/saveFood?date=${date}&user_id=${userId}`);
      return safeFetch<FoodType>(
        () =>
          fetch(fullUrl, { cache: "no-store", credentials: "include" }),
        "Failed to fetch food"
      );
    },
    staleTime: 1000 * 60 * 15,
    retry: 1,
  });
