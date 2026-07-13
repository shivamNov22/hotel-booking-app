const addOnService = require("../services/addOnService");

async function getAddOns(req, res) {
  try {
    const addOns = await addOnService.getActiveAddOns();
    return res.status(200).json({ success: true, addOns });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getAddOns };
