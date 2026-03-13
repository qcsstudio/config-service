const express = require("express");
const router = express.Router();
const auth = require("../../../../middlewares/auth.middleware")
const {
  createOrUpdateLeaveCycle,
//   updateLeaveCycleById,
  getLeaveCycle,
} = require("./leaveCycle.controller");

// Create or Update (single record pattern)
router.post("/createORupdate/leave-cycle",auth ,createOrUpdateLeaveCycle);

// Update by ID
// router.put("/update/leave-cycle/:id", updateLeaveCycleById);

// Get one
router.get("/getOne/leave-cycle",auth, getLeaveCycle);

module.exports = router;