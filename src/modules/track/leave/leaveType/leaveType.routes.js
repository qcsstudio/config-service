const express = require("express");
const router = express.Router();
const leaveTypeController = require("./leaveType.controller");
const auth = require("../../../../middlewares/auth.middleware"); // JWT middleware

// ===============================
// CREATE Leave Type
// ===============================
router.post(
  "/create/leaveType",
  auth, // must be logged in
  leaveTypeController.createLeaveType
);

// ===============================
// UPDATE Leave Type
// ===============================
router.put(
  "/update/leaveType/:id",
  leaveTypeController.updateLeaveType
);

// ===============================
// GET All Leave Types
// ===============================
router.get(
  "/get-all/leaveType",
  leaveTypeController.getAllLeaveTypes
);

// ===============================
// GET Single Leave Type
// ===============================
router.get(
  "/getOne/leaveType/:id",
  leaveTypeController.getLeaveTypeById
);

module.exports = router;