import { apiSlice } from "./apiSlice";

export const addOnApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/addons — "Add to your stay" section
    getAddOns: builder.query({
      query: () => "/addons",
    }),
  }),
  overrideExisting: false,
});

export const { useGetAddOnsQuery } = addOnApi;
