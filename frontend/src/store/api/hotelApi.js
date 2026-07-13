import { apiSlice } from "./apiSlice";

export const hotelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotelBySlug: builder.query({
      query: (slug) => ({ url: `/hotels/${slug}`, method: "GET" }),
      providesTags: (result, error, slug) => [{ type: "Hotel", id: slug }],
    }),
    checkAvailability: builder.query({
      query: ({ slug, checkIn, nights }) => ({
        url: `/hotels/${slug}/availability`,
        method: "GET",
        params: { checkIn, nights },
      }),
    }),
  }),
});

export const { useGetHotelBySlugQuery, useLazyCheckAvailabilityQuery } =
  hotelApi;
