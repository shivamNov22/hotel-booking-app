import { apiSlice } from "./apiSlice";

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyPromoCode: builder.mutation({
      query: ({ code, subtotal }) => ({
        url: "/promo",
        method: "POST",
        data: { code, subtotal },
      }),
      invalidatesTags: ["Promo"],
    }),
    createBooking: builder.mutation({
      query: (payload) => ({
        url: "/bookings",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const { useApplyPromoCodeMutation, useCreateBookingMutation } =
  bookingApi;
