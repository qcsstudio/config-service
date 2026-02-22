const express = require("express");
const router = express.Router();
const {
  createExtraTimePolicy,
  getAllExtraTimePolicies,
} = require("./extraTime.controller");

const auth = require("../../../../middlewares/auth.middleware");

// Get all policies
router.post("/extra-time", auth, createExtraTimePolicy);

// Get single policy by ID
router.get("/extra-time-getAll",  getAllExtraTimePolicies);

module.exports = router;
