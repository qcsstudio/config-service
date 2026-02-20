const express = require("express");
const router = express.Router();

const {
  createShift,
  getAllShifts,
  getShiftById,
  updateShift,
  deleteShift
} = require("./shift.controller");

// If you have auth middleware
const auth= require("../../../../middlewares/auth.middleware"); // adjust path if needed


// ===========================
// SHIFT ROUTES
// Base URL: /api/shifts
// =============================

// Create Shift
router.post("/shift-create", auth, createShift);

// Get All Shifts
router.get("/getAll-create",  getAllShifts);

// Get Shift By ID
router.get("/getOne-shift/:id", getShiftById);

// Update Shift
router.put("/update-shift/:id", updateShift);

// Delete Shift
router.delete("/delete-shift/:id",  deleteShift);


module.exports = router;
