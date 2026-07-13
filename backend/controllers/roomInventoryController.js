const roomInventoryService = require("../services/roomInventoryService");

async function getRooms(req, res) {
  try {
    const { search, roomType, availabilityStatus, sortBy, page, limit } =
      req.query;

    const data = await roomInventoryService.getRooms({
      search,
      roomType,
      availabilityStatus,
      sortBy,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      ...data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getRoomById(req, res) {
  try {
    const room = await roomInventoryService.getRoomById(req.params.roomId);

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    return res.status(200).json({ success: true, room });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function createRoom(req, res) {
  try {
    const room = await roomInventoryService.createRoom(req.body);
    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// PUT /api/admin/rooms/:roomId
async function updateRoom(req, res) {
  try {
    const room = await roomInventoryService.updateRoom(
      req.params.roomId,
      req.body,
    );

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateAmenities(req, res) {
  try {
    const room = await roomInventoryService.updateAmenities(
      req.params.roomId,
      req.body.amenities,
    );

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Amenities updated successfully",
      room,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteRoom(req, res) {
  try {
    const room = await roomInventoryService.deleteRoom(req.params.roomId);

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateAmenities,
  deleteRoom,
};
