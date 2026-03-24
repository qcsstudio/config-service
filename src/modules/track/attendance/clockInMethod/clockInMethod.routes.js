const express = require("express");
const router = express.Router();
const auth= require("../../../../middlewares/auth.middleware");

const {
  createClockInMethod,
  getAllClockInMethods,
  updateClockInMethod,
  deleteClockInMethod,
  validateWFH
} = require("./clockInMethod.controller");

// Create
router.post("/create/clock-In-Mehtod",auth, createClockInMethod);

// Get All
router.get("/getAll/clock-In-Mehtod", getAllClockInMethods);
// ✅ Update
router.put("/clock-in-method-update/:id", updateClockInMethod);

// ✅ Soft Delete
router.delete("/clock-in-method-delete/:id", deleteClockInMethod);
router.post("/validate-wfh", validateWFH);
module.exports = router;
