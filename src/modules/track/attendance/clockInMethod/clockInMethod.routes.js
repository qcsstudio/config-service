const express = require("express");
const router = express.Router();
const auth= require("../../../../middlewares/auth.middleware");

const {
  createClockInMethod,
  getAllClockInMethods
} = require("./clockInMethod.controller");

// Create
router.post("/create/clock-In-Mehtod",auth, createClockInMethod);

// Get All
router.get("/getAll/clock-In-Mehtod", getAllClockInMethods);

module.exports = router;
