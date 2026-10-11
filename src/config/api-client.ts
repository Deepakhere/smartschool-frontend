import axios from "axios";
import get from "lodash.get";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { APIS_ROUTES, USER_ACCESS_KEY, authCookieOptions } from "../utils";
import { isAuthPage } from "./auth-pages";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// separate instance for the refresh call itself — must never go through
// apiClient's own interceptors, or a failed refresh would recurse into itself
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const formatApiError = (error: unknown) => ({
  status: get(error, "response.status"),
  response: get(error, "response.data"),
  message: get(error, "response.data.Error.message"),
});

const clearSessionAndRedirect = () => {
  Cookies.remove(USER_ACCESS_KEY.TOKEN);
  Cookies.remove(USER_ACCESS_KEY.REFRESH_TOKEN);
  Cookies.remove(USER_ACCESS_KEY.ROLE);
  if (!isAuthPage()) {
    window.location.href = "/login";
  }
};

const bearerOf = (headers: unknown) => String(get(headers, "accesstoken", "")).replace(/^Bearer /, "");

// Swaps the refresh token for new tokens, one tab at a time. The server rotates refresh tokens (the old one stops
// working at once), so two tabs refreshing together would make one of them fail and sign the user out; a browser lock
// lets one tab refresh while the others wait, and the waiting ones then find the new token already saved.
// `failedToken` is the access token the rejected request carried.
let refreshInFlight: Promise<string> | null = null;

const refreshTokens = (failedToken: string): Promise<string> => {
  const run = async () => {
    const current = Cookies.get(USER_ACCESS_KEY.TOKEN);
    if (current && current !== failedToken) return current;

    const refreshToken = Cookies.get(USER_ACCESS_KEY.REFRESH_TOKEN);
    if (!refreshToken) throw new Error("No refresh token");
    try {
      const { data } = await refreshClient.post(APIS_ROUTES.REFRESH_TOKEN, { refreshToken });
      const newToken = data?.Data?.token;
      if (!newToken) throw new Error("Refresh did not return a token");

      Cookies.set(USER_ACCESS_KEY.TOKEN, newToken, authCookieOptions(1));
      if (data?.Data?.refreshToken) Cookies.set(USER_ACCESS_KEY.REFRESH_TOKEN, data.Data.refreshToken, authCookieOptions(30));
      return newToken as string;
    } catch (error) {
      // another tab may have refreshed with this same token a moment earlier; its new token is still good
      const latest = Cookies.get(USER_ACCESS_KEY.TOKEN);
      if (latest && latest !== failedToken && Cookies.get(USER_ACCESS_KEY.REFRESH_TOKEN) !== refreshToken) return latest;
      throw error;
    }
  };

  // within this tab, requests that fail together share one refresh
  refreshInFlight ??= (navigator.locks ? navigator.locks.request("opscul-token-refresh", run) : run()).finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
};

// Request interceptor to add token to request headers
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get(USER_ACCESS_KEY.TOKEN);

    if (accessToken) {
      config.headers["accesstoken"] = `Bearer ${accessToken}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["content-type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(new Error(error.response.data))
);

// Response interceptor
apiClient.interceptors.response.use(
  // Return the response as-is
  (response) => response,

  // Handle errors
  async (error) => {
    // a failed file download (receipt, report card) carries its JSON error as a Blob; read it so callers get the message
    const body = error?.response?.data;
    if (typeof Blob !== "undefined" && body instanceof Blob && body.type.includes("json")) {
      try {
        error.response.data = JSON.parse(await body.text());
      } catch {
        // not JSON after all; keep the generic message
      }
    }

    const originalRequest = error.config;
    const status = error?.response?.status;
    const isAuthRoute =
      originalRequest?.url?.includes(APIS_ROUTES.REFRESH_TOKEN) ||
      originalRequest?.url?.includes(APIS_ROUTES.SIGNIN);

    // 401 on any non-auth route: refresh once and retry. Everything that ends a session goes through
    // clearSessionAndRedirect, the one place that decides "the session is over, go to /login".
    if (status === 401 && !isAuthRoute) {
      if (originalRequest?._retry || !Cookies.get(USER_ACCESS_KEY.REFRESH_TOKEN)) {
        clearSessionAndRedirect();
        return Promise.reject(formatApiError(error));
      }
      originalRequest._retry = true;

      try {
        const newToken = await refreshTokens(bearerOf(originalRequest.headers));
        originalRequest.headers["accesstoken"] = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        clearSessionAndRedirect();
        return Promise.reject(formatApiError(error));
      }
    }

    // A refusal (403) is answered where it happened: the page shows it, and routes are already guarded by role.
    // Sending the whole app to "access denied" because one background request was refused threw people off pages
    // they were allowed to use.
    if (status === 405) {
      toast.error("Your session has expired. Please sign in again.");
      clearSessionAndRedirect();
    } else if (status && status >= 500) {
      // one toast however many requests failed at once
      toast.error(get(error, "response.data.Error.message") || "Something went wrong on our side. Please try again.", {
        id: "server-error",
      });
    }

    return Promise.reject(formatApiError(error));
  }
);

export default apiClient;
