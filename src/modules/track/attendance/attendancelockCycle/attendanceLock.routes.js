const express = require("express");
const router = express.Router();

const {
  upsertAttendanceLockCycle,
  getAttendanceLockCycle,
} = require("./attendanceLock.controller");

const authMiddleware = require("../../../../middlewares/auth.middleware");


// ✅ Create OR Update (Upsert)
router.post(
  "/attendance-lock-cycle",
  authMiddleware,
  upsertAttendanceLockCycle
);


// ✅ Get by companyId (from logged-in user)
router.get(
  "/attendance-lock-cycle",
  authMiddleware,
  getAttendanceLockCycle
);


module.exports = router;