import { axiosInstance } from "./axiosInstance";

/**
 * Custom RTK Query baseQuery backed by Axios so the app can talk to any
 * REST backend (or, in this project, the Next.js route handlers under
 * src/app/api) with consistent error shaping and interceptors.
 */
export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status ?? "FETCH_ERROR",
          data: err.response?.data ?? err.message,
        },
      };
    }
  };
