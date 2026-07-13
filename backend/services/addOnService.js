const AddOn = require("../models/AddOn");

async function getActiveAddOns() {
  return AddOn.find({ isActive: true }).lean();
}

async function getAddOnsByIds(addOnIds = []) {
  if (!addOnIds.length) return [];
  return AddOn.find({ addOnId: { $in: addOnIds }, isActive: true }).lean();
}

module.exports = { getActiveAddOns, getAddOnsByIds };
