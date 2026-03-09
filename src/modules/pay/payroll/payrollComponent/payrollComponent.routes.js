const express = require("express");
const router = express.Router();

const {
  createPayrollComponent,
  getAllPayrollComponents,
} = require("./payrollComponent.controller");
const auth = require("../../../../middlewares/auth.middleware");
// ✅ Create
router.post("/create/component",auth, createPayrollComponent);

// ✅ Get All (Company Wise)
router.get("/get-all/component",auth, getAllPayrollComponents);

module.exports = router;