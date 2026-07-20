import { FoodClass } from "@/types/Types";
import { safeFetch, buildApiUrl } from "./safeFetch";

export const getSearchedFoodOptions = (
  searchTerm: string,
  currentLocale: string,
) => ({
  queryKey: ["foodSearch", searchTerm, currentLocale],
  mutationFn: () => {
    const fullUrl = buildApiUrl(
      `/api/food?searchTerm=${encodeURIComponent(searchTerm)}&currentLocale=${encodeURIComponent(currentLocale)}`
    );
    console.log(`[getSearchedFoodOptions] Fetching: ${fullUrl}`);
    return safeFetch<(FoodClass & { originalName?: string })[]>(
      () =>
        fetch(fullUrl, {
          credentials: "include",
          method: "GET",
        }),
      "Food search request failed"
    );
  },
});
