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
  auth,
  attendanceController.getAllAttendancePolicies
);
router.get('/attendance-policy/:id',attendanceController.getAttendancePolicyById);
router.put("/attendance-policy-update/:id",  attendanceController.updateAttendancePolicy);
router.delete("/attendance-policy-delete/:id", attendanceController.deleteAttendancePolicy);

module.exports = router;
