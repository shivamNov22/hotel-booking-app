import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/auth/admin/login
    adminLogin: builder.mutation({
      query: (body) => ({
        url: "/auth/admin/login",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useAdminLoginMutation } = authApi;
