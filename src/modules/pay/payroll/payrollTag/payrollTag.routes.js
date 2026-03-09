const express = require("express");
const router = express.Router();

const {
  createPayrollTag,
  getAllPayrollTags,
} = require("./payrollTag.controller");
const auth = require("../../../../middlewares/auth.middleware")
// 🔹 Create Payroll Tag
router.post("/create/payrollTag",auth, createPayrollTag);

// 🔹 Get All Payroll Tags (with optional country filter)
router.get("/get-all/payrollTag",auth, getAllPayrollTags);

module.exports = router;