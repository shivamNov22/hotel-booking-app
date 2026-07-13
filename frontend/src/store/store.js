import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import bookingReducer from "./slices/bookingSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      booking: bookingReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
}

export const store = makeStore();
