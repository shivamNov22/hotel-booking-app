const Room = require("../models/Room");

async function generateRoomId() {
  const lastRoom = await Room.findOne().sort({ createdAt: -1 }).lean();

  if (!lastRoom || !lastRoom.roomId) {
    return "RS001";
  }

  const lastNumber = parseInt(lastRoom.roomId.replace("RS", ""), 10) || 0;
  const nextNumber = lastNumber + 1;

  return `RS${String(nextNumber).padStart(3, "0")}`;
}

module.exports = generateRoomId;
