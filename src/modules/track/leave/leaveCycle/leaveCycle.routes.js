const express = require("express");
const router = express.Router();

const {
  createOrUpdateLeaveCycle,
//   updateLeaveCycleById,
  getLeaveCycle,
} = require("./leaveCycle.controller");

// Create or Update (single record pattern)
router.post("/createORupdate/leave-cycle", createOrUpdateLeaveCycle);

// Update by ID
// router.put("/update/leave-cycle/:id", updateLeaveCycleById);

// Get one
router.get("/getOne/leave-cycle", getLeaveCycle);

module.exports = router;