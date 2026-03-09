const express = require("express");
const router = express.Router();

const {
  addSignAuthority,
  assignAuthority,
  getAllPayrollSignatures,
} = require("./payrollSignature.controller");

// 🔐 Import your auth middleware
const auth = require("../../../../middlewares/auth.middleware");

// ======================================
// ✅ ADD SIGN AUTHORITY (Create Only)
// ======================================
router.post(
  "/add-sign-authority",
  auth,
  addSignAuthority
);

// ======================================
// ✅ ASSIGN AUTHORITY (Update Only)
// ======================================
router.put(
  "/assign-authority",
  auth,
  assignAuthority
);

// ======================================
// ✅ GET ALL SIGNATURES
// ======================================
router.get(
  "/get-all",
  auth,
  getAllPayrollSignatures
);

module.exports = router;