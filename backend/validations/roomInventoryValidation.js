const Joi = require("joi");

const ROOM_TYPES = ["Executive Suite", "Deluxe", "Single"];
const STATUS_TYPES = ["Available", "Occupied", "Maintenance"];

// POST /api/admin/rooms  -> Add New Room
const createRoomSchema = Joi.object({
  roomName: Joi.string().trim().min(2).max(100).required(),
  roomType: Joi.string()
    .valid(...ROOM_TYPES)
    .required(),
  image: Joi.string().uri().allow("", null),
  basePrice: Joi.number().min(0).required(),
  availabilityStatus: Joi.string()
    .valid(...STATUS_TYPES)
    .default("Available"),
  amenities: Joi.array().items(Joi.string().trim()).default([]),
});

// PUT /api/admin/rooms/:id -> Edit Room (all fields optional, at least 1 required)
const updateRoomSchema = Joi.object({
  roomName: Joi.string().trim().min(2).max(100),
  roomType: Joi.string().valid(...ROOM_TYPES),
  image: Joi.string().uri().allow("", null),
  basePrice: Joi.number().min(0),
  availabilityStatus: Joi.string().valid(...STATUS_TYPES),
  amenities: Joi.array().items(Joi.string().trim()),
}).min(1);

// PATCH /api/admin/rooms/:id/amenities -> Edit Amenities only
const updateAmenitiesSchema = Joi.object({
  amenities: Joi.array().items(Joi.string().trim()).required(),
});

// GET /api/admin/rooms -> query params (search/filter/sort/pagination)
const getRoomsQuerySchema = Joi.object({
  search: Joi.string().trim().allow(""),
  roomType: Joi.string().valid(...ROOM_TYPES, ""),
  availabilityStatus: Joi.string().valid(...STATUS_TYPES, ""),
  sortBy: Joi.string()
    .valid("roomId_asc", "roomId_desc", "price_asc", "price_desc")
    .default("roomId_asc"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
  updateAmenitiesSchema,
  getRoomsQuerySchema,
};
