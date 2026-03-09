const express = require("express");
const router = express.Router();
const controller = require("./payrollMisc.controller");
const auth = require("../../../../middlewares/auth.middleware");

// Single
router.post("/get", auth, controller.createPayrollMiscSettings);

// All
router.get("/get-all/payroll-misc", auth, controller.getAllPayrollMiscSettings);

module.exports = router;