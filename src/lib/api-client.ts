import { authClient, getBaseURL } from "./auth-client";

export type UploadResponse = {
  data?: {
    imageUrl?: string;
  };
  imageUrl?: string;
};

export type RNFormData = FormData & {
  append(name: string, value: string | Blob | { uri: string; name?: string; type?: string }): void;
};


/**
 * Gets authentication headers (Authorization and Cookie) from the authClient.
 */
export const getAuthHeaders = (): HeadersInit => {
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
};

/**
 * An authenticated wrapper around fetch that automatically appends
 * session/auth headers from better-auth.
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const authHeaders = getAuthHeaders();
  const mergedHeaders = {
    ...authHeaders,
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers: mergedHeaders,
  });
};

/**
 * Creates and configures an XMLHttpRequest with appropriate authentication headers.
 * Useful for handling file uploads (e.g. with FormData and progress monitoring).
 */
export const createAuthenticatedXHR = (method: string, url: string): XMLHttpRequest => {
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
};

/**
 * Uploads a local photo URI to the server.
 * 
 * @param uri The local filesystem URI of the picture.
 * @returns A Promise resolving to the uploaded image URL.
 */
export const uploadImage = async (uri: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Mobile picture handling: construct FormData compatible with React Native
    const fileName = uri.split("/").pop() || "avatar.jpg";
    const match = /\.(\w+)$/.exec(fileName);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const formData = new FormData() as RNFormData;
    formData.append("file", {
      uri,
      name: fileName,
      type,
    });

    // We must use XMLHttpRequest (XHR) instead of global fetch because React Native's 
    // fetch implementation fails to serialize the custom { uri, name, type } object 
    // structure inside FormData, resulting in "Unsupported FormDataPart implementation".
    const xhr = createAuthenticatedXHR("POST", `${getBaseURL()}/api/upload`);

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText) as UploadResponse;
        const imageUrl = response.data?.imageUrl || response.imageUrl;
        if (imageUrl) {
          resolve(imageUrl);
        } else {
          reject(new Error("Failed to upload image"));
        }
      } catch (e) {
        reject(e);
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network request failed"));
    };

    xhr.send(formData);
  });
};
