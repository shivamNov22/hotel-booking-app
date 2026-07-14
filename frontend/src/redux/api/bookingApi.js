import { apiSlice } from "./apiSlice";

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/bookings/details?roomId=&checkIn=&checkOut= — room + price preview
    getBookingDetails: builder.query({
      query: ({ roomId, checkIn, checkOut }) => ({
        url: "/bookings/details",
        params: { roomId, checkIn, checkOut },
      }),
    }),

    // POST /api/bookings — final "Book Now" + Guest Info submit, creates a Pending booking
    createBooking: builder.mutation({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
    }),

    // GET /api/bookings/:bookingId — Booking Confirmation page, right after payment
    getBookingConfirmation: builder.query({
      query: (bookingId) => `/bookings/${bookingId}`,
    }),

    // GET /api/bookings/lookup?bookingId=&email= — "My Bookings" search (not built into UI yet)
    lookupBooking: builder.query({
      query: ({ bookingId, email }) => ({
        url: "/bookings/lookup",
        params: { bookingId, email },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBookingDetailsQuery,
  useLazyGetBookingDetailsQuery,
  useCreateBookingMutation,
  useGetBookingConfirmationQuery,
  useLazyLookupBookingQuery,
} = bookingApi;
