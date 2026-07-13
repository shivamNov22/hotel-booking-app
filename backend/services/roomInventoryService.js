const Room = require("../models/Room");
const generateRoomId = require("../utils/generateRoomId");

// Map UI "Sort by" options to actual DB sort objects
const SORT_MAP = {
  roomId_asc: { roomId: 1 },
  roomId_desc: { roomId: -1 },
  price_asc: { basePrice: 1 },
  price_desc: { basePrice: -1 },
};

/**
 * List rooms with search, filters, sorting & pagination
 * (Search Rooms / Filter by Type / Filter by Availability / Sort by / pagination in UI)
 */
async function getRooms({
  search,
  roomType,
  availabilityStatus,
  sortBy,
  page,
  limit,
}) {
  const filter = {};

  if (search) {
    // search by Room Name or Room ID
    filter.$or = [
      { roomName: { $regex: search, $options: "i" } },
      { roomId: { $regex: search, $options: "i" } },
    ];
  }

  if (roomType) {
    filter.roomType = roomType;
  }

  if (availabilityStatus) {
    filter.availabilityStatus = availabilityStatus;
  }

  const sort = SORT_MAP[sortBy] || SORT_MAP.roomId_asc;
  const skip = (page - 1) * limit;

  const [rooms, totalRooms] = await Promise.all([
    Room.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Room.countDocuments(filter),
  ]);

  return {
    rooms,
    pagination: {
      totalRooms,
      currentPage: page,
      totalPages: Math.ceil(totalRooms / limit) || 1,
      rowsPerPage: limit,
    },
  };
}

// Get a single room by its roomId (RS001 etc.) - used for "Edit" prefill
async function getRoomById(roomId) {
  const room = await Room.findOne({ roomId }).lean();
  return room;
}

// "+ Add New Room"
async function createRoom(data) {
  const roomId = await generateRoomId();
  const room = await Room.create({ ...data, roomId });
  return room;
}

// Edit icon (pencil) -> update room details
async function updateRoom(roomId, data) {
  const room = await Room.findOneAndUpdate({ roomId }, data, {
    new: true,
    runValidators: true,
  }).lean();
  return room;
}

// "Edit Amenities" link
async function updateAmenities(roomId, amenities) {
  const room = await Room.findOneAndUpdate(
    { roomId },
    { amenities },
    { new: true, runValidators: true },
  ).lean();
  return room;
}

// Delete (trash) icon
async function deleteRoom(roomId) {
  const room = await Room.findOneAndDelete({ roomId }).lean();
  return room;
}

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateAmenities,
  deleteRoom,
};
