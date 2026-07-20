import { AIFoodAnalysis } from "@/types/Types";
import { safeFetch, buildApiUrl } from "./safeFetch";

export const FoodImageAIOptions = (localization: string) => ({
  mutationFn: (imageBase64: string) => {
    const fullUrl = buildApiUrl("/api/foodImageAI");
    return safeFetch<AIFoodAnalysis>(
      () =>
        fetch(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64, localization }),
        }),
      "Failed to analyze image"
    );
  },
});
