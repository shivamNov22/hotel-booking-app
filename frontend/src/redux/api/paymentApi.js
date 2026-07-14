import { apiSlice } from "./apiSlice";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/payments/create-order — "Make Payment" click
    createOrder: builder.mutation({
      query: (bookingId) => ({
        url: "/payments/create-order",
        method: "POST",
        body: { bookingId },
      }),
    }),

    // POST /api/payments/verify — payment result callback (dummy gateway for now)
    verifyPayment: builder.mutation({
      query: (body) => ({
        url: "/payments/verify",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCreateOrderMutation, useVerifyPaymentMutation } = paymentApi;
