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

    // GET /api/bookings/lookup?bookingId=&email= — "My Bookings" search
    lookupBooking: builder.query({
      query: ({ bookingId, email }) => ({
        url: "/bookings/lookup",
        params: { bookingId, email },
      }),
    }),

    // GET /api/bookings/admin/all?status=&page=&limit= — Admin > Bookings table
    // response: { success, total, page, pages, count, statusCounts: [{_id, count}], bookings: [...] }
    getAdminBookings: builder.query({
      query: (params = {}) => ({
        url: "/bookings/admin/all",
        params, // { status, page, limit }
      }),
      providesTags: (result) =>
        result?.bookings
          ? [
              ...result.bookings.map((b) => ({ type: "Booking", id: b.bookingId })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],
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
  useGetAdminBookingsQuery,
} = bookingApi;
