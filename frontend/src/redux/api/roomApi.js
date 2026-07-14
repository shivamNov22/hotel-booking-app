import { apiSlice } from "./apiSlice";

export const roomApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/admin/rooms?search=&roomType=&availabilityStatus=&sortBy=&page=&limit=
    getRooms: builder.query({
      query: (params = {}) => ({
        url: "/admin/rooms",
        params, // { search, roomType, availabilityStatus, sortBy, page, limit }
      }),
      // response: { success, rooms: [...], pagination: {...} }
      providesTags: (result) =>
        result?.rooms
          ? [
              ...result.rooms.map((r) => ({ type: "Room", id: r.roomId })),
              { type: "Room", id: "LIST" },
            ]
          : [{ type: "Room", id: "LIST" }],
    }),

    // GET /api/admin/rooms/:roomId — used to prefill the Edit modal
    getRoomById: builder.query({
      query: (roomId) => `/admin/rooms/${roomId}`,
      providesTags: (result, error, roomId) => [{ type: "Room", id: roomId }],
    }),

    // POST /api/admin/rooms — "+ Add New Room"
    addRoom: builder.mutation({
      query: (body) => ({
        url: "/admin/rooms",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Room", id: "LIST" }],
    }),

    // PUT /api/admin/rooms/:roomId — pencil "Edit" icon
    editRoom: builder.mutation({
      query: ({ roomId, ...body }) => ({
        url: `/admin/rooms/${roomId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { roomId }) => [
        { type: "Room", id: roomId },
        { type: "Room", id: "LIST" },
      ],
    }),

    // PATCH /api/admin/rooms/:roomId/amenities — "Edit Amenities" link
    updateAmenities: builder.mutation({
      query: ({ roomId, amenities }) => ({
        url: `/admin/rooms/${roomId}/amenities`,
        method: "PATCH",
        body: { amenities },
      }),
      invalidatesTags: (result, error, { roomId }) => [
        { type: "Room", id: roomId },
        { type: "Room", id: "LIST" },
      ],
    }),

    // DELETE /api/admin/rooms/:roomId — trash icon
    deleteRoom: builder.mutation({
      query: (roomId) => ({
        url: `/admin/rooms/${roomId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Room", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useAddRoomMutation,
  useEditRoomMutation,
  useUpdateAmenitiesMutation,
  useDeleteRoomMutation,
} = roomApi;
