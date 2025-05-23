import axios from "axios";
import get from "lodash.get";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { USER_ACCESS_KEY } from "../utils";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor to add token to request headers
apiClient.interceptors.request.use(
  async (config) => {
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
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      typeof window !== "undefined"
    ) {
      // Handle 401/403 errors
      window.location.href = "/not-access";
    } else if (
      error.response &&
      (error?.response?.status === 400 || error?.response?.status === 404)
    ) {
      // window.location.href = "/not-access";
    } else if (
      error?.response?.status === 405 ||
      (window.location.href !== "/login" &&
        window.location.href !== "/forgot-password")
    ) {
      toast.error("token is expired please login and continue");
      Cookies.remove(USER_ACCESS_KEY.TOKEN);
      window.location.href = "/login";
    } else if (
      error?.response?.status === 500 ||
      error?.response?.status === 503
    ) {
      alert("Server under maintenance");
    }

    return Promise.reject({
      status: get(error, "response.status"),
      response: get(error, "response.data"),
      message: get(error, "response.data.Error.message"),
    });
  }
);

// Custom response transformation (optional)
// const transformResponse = (response: any) => ({
//   statusCode: response.status,
//   response: response.data,
// });

// export { transformResponse };
export default apiClient;
