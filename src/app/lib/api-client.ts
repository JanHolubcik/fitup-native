import { authClient } from "./auth-client";

/**
 * Gets authentication headers (Authorization and Cookie) from the authClient.
 */
export function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  try {
    const cookie = authClient.getCookie();
    if (cookie) {
      headers["cookie"] = cookie;
      const tokenMatch = cookie.match(/session_token=([^;]+)/);
      if (tokenMatch && tokenMatch[1]) {
        headers["Authorization"] = `Bearer ${tokenMatch[1]}`;
      }
    }
  } catch (err) {
    console.error("Error retrieving auth token:", err);
  }
  return headers;
}

/**
 * An authenticated wrapper around fetch that automatically appends
 * session/auth headers from better-auth.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeaders = getAuthHeaders();
  const mergedHeaders = {
    ...authHeaders,
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers: mergedHeaders,
  });
}

/**
 * Creates and configures an XMLHttpRequest with appropriate authentication headers.
 * Useful for handling file uploads (e.g. with FormData and progress monitoring).
 */
export function createAuthenticatedXHR(method: string, url: string): XMLHttpRequest {
  console.log("[api-client] createAuthenticatedXHR called for", url);
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);

  try {
    const cookie = authClient.getCookie();
    console.log("[api-client] getCookie returned:", cookie ? "Cookie found" : "No cookie");
    if (cookie) {
      xhr.setRequestHeader("cookie", cookie);
      const tokenMatch = cookie.match(/session_token=([^;]+)/);
      if (tokenMatch && tokenMatch[1]) {
        console.log("[api-client] tokenMatch found, setting Bearer header");
        xhr.setRequestHeader("Authorization", `Bearer ${tokenMatch[1]}`);
      } else {
        console.log("[api-client] No session_token matched in cookie");
      }
    }
  } catch (err) {
    console.error("[api-client] Error setting auth headers on XHR:", err);
  }

  return xhr;
}
