const express = require("express");
const router = express.Router();

const {
  createPayrollMethod,
  getPayrollMethod
} = require("./payrollMethod.controller");

const verifyToken = require("../../../../middlewares/auth.middleware");

/*
-----------------------------------------
Payroll Method Routes
-----------------------------------------
*/

// Create or Update Payroll Method
router.post("/payroll-method", verifyToken, createPayrollMethod);

// Get Payroll Method by companyId
router.get("/payroll-method", verifyToken, getPayrollMethod);

module.exports = router;