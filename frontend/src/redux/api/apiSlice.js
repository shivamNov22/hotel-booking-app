import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Central base query — every module (rooms, and later bookings/customers)
// injects its endpoints into this same api instance so RTK Query's caching
// and tag invalidation work consistently across the whole admin app.
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api",
    credentials: "include", // sends the httpOnly auth cookie set by /api/auth/*
    prepareHeaders: (headers) => {
      // If you switch to header-based auth instead of the cookie, read the
      // admin token from wherever you store it (e.g. a small authSlice) and:
      // headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Room", "Booking"],
  endpoints: () => ({}),
});
