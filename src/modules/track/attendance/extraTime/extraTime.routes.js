const express = require("express");
const router = express.Router();
const {
  getAllExtraTimePolicies,
  getExtraTimePolicyById,
} = require("../controllers/extraTimeController");

const auth = require("../../../../middlewares/auth.middleware");

// Get all policies
router.post("/extra-time", auth, getAllExtraTimePolicies);

// Get single policy by ID
router.get("/extra-time/:id",  getExtraTimePolicyById);

module.exports = router;
