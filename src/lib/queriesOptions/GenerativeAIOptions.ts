import { SavedFoodMonth } from "@/types/Types";
import { safeFetch, buildApiUrl } from "./safeFetch";

export const GenerativeAIOptions = (savedFood: SavedFoodMonth) => ({
  mutationFn: () => {
    const fullUrl = buildApiUrl("/api/generateResponseAI");
    return safeFetch<string>(
      () =>
        fetch(fullUrl, {
          credentials: "include",
          body: JSON.stringify({
            message: "Please analyze my food intake",
            savedFood: savedFood,
          }),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      "Request failed"
    );
  },
});
