const express = require("express");
const router = express.Router();

const attendanceController = require("./attendancePolicy.controller");
const auth = require("../../../../middlewares/auth.middleware"); // your JWT middleware

// 🔹 CREATE POLICY
router.post(
  "/attendance-policy",
  auth,
  attendanceController.createAttendancePolicy
);

// 🔹 GET ALL POLICIES
router.get(
  "/attendance-policy-getAll",
  attendanceController.getAllAttendancePolicies
);

module.exports = router;
