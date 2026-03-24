const express = require("express");
const router = express.Router();
const {
  createExtraTimePolicy,
  getAllExtraTimePolicies,
   updateExtraTimePolicy,
   deleteExtraTimePolicy,
   getExtraTimePolicyById
} = require("./extraTime.controller");

const auth = require("../../../../middlewares/auth.middleware");

// Get all policies
router.post("/extra-time", auth, createExtraTimePolicy);

// Get single policy by ID
router.get("/extra-time-getAll",auth,  getAllExtraTimePolicies);
router.get("/extra-time-getOne/:id",  getExtraTimePolicyById);



// ✅ Update
router.put("/extra-time-policy-update/:id",  updateExtraTimePolicy);

// ✅ Soft Delete
router.delete("/extra-time-policy-delete/:id",  deleteExtraTimePolicy);
module.exports = router;
