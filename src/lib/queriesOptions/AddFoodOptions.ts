import { FoodInput, FoodClass } from "@/types/Types";
import { safeFetch, buildApiUrl } from "./safeFetch";

export const AddFoodOptions = () => ({
  mutationFn: (foodData: FoodInput) => {
    const fullUrl = buildApiUrl("/api/food");
    return safeFetch<FoodClass>(
      () =>
        fetch(fullUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(foodData),
          credentials: "include",
        }),
      "Failed to add food to database"
    );
  },
});
