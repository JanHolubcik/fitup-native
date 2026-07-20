import { ApiResponse } from "@/types/Types";
import { getBaseURL } from "../auth-client";

export const buildApiUrl = (path: string): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const baseUrl = getBaseURL() || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const safeFetch = async <T>(
  requestFn: () => Promise<Response>,
  fallbackErrorMessage: string = "Request failed"
): Promise<T> => {
  if (typeof window !== "undefined" && navigator.onLine === false) {
    console.error("[safeFetch Error]: Device is offline");
    throw new Error("OFFLINE");
  }

  try {
    const response = await requestFn();
    console.log(`[safeFetch Response] Status ${response.status} for URL: ${response.url}`);

    if (response.status === 429) {
      console.error("[safeFetch Error]: Rate limited (429)");
      throw new Error("RATE_LIMIT");
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[safeFetch HTTP Error ${response.status}]: ${response.url}`, text);
      throw new Error(`SERVER_ERROR (${response.status}): ${text || response.statusText}`);
    }

    const result = (await response.json().catch((err) => {
      console.error("[safeFetch JSON Parse Error]:", err);
      return {};
    })) as ApiResponse<T>;

    if (!result.success) {
      console.error(`[safeFetch API Error] ${fallbackErrorMessage}:`, result.error);
      throw new Error(result.error || fallbackErrorMessage);
    }

    return result.data as T;
  } catch (error) {
    console.error(`[safeFetch Exception] ${fallbackErrorMessage}:`, error);
    if (error instanceof TypeError && error.message.toLowerCase().includes("failed to fetch")) {
      throw new Error("OFFLINE");
    }
    throw error;
  }
};
