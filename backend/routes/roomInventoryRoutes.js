const express = require("express");
const router = express.Router();

const roomInventoryController = require("../controllers/roomInventoryController");
const validate = require("../middleware/validate");
const {
  createRoomSchema,
  updateRoomSchema,
  updateAmenitiesSchema,
  getRoomsQuerySchema,
} = require("../validations/roomInventoryValidation");

router.get(
  "/",
  validate(getRoomsQuerySchema, "query"),
  roomInventoryController.getRooms,
);

router.get("/:roomId", roomInventoryController.getRoomById);

router.post(
  "/",
  validate(createRoomSchema),
  roomInventoryController.createRoom,
);

router.put(
  "/:roomId",
  validate(updateRoomSchema),
  roomInventoryController.updateRoom,
);

router.patch(
  "/:roomId/amenities",
  validate(updateAmenitiesSchema),
  roomInventoryController.updateAmenities,
);

router.delete("/:roomId", roomInventoryController.deleteRoom);

module.exports = router;
