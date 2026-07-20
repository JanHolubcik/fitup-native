import { FoodType } from "@/types/Types";
import { safeFetch, buildApiUrl } from "./safeFetch";

export const SaveFoodOptions = () => ({
  mutationFn: ({
    date,
    savedFood,
    userID,
  }: {
    date: string;
    savedFood: FoodType;
    userID: string;
  }) => {
    const fullUrl = buildApiUrl("/api/saveFood");
    return safeFetch<string>(
      () =>
        fetch(fullUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            savedFood,
            userID,
          }),
          credentials: "include",
        }),
      "Failed to save food"
    );
  },
});
