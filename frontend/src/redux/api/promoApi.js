import { apiSlice } from "./apiSlice";

export const promoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/promo/validate — "Apply" button, discount preview only
    validatePromo: builder.mutation({
      query: (body) => ({
        url: "/promo/validate",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useValidatePromoMutation } = promoApi;
