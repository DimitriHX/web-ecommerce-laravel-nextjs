import { getAuthToken } from "./auth";

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.BASE_URL || "http://localhost:8000/api";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
}

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = false, headers = {}, ...rest } = options;
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = await getAuthToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.message || `Error en la solicitud: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data as T;
}
