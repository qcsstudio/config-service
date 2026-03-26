const express = require("express");
const router = express.Router();

const {
  addSignAuthority,
  assignAuthority,
  getAllPayrollSignatures,
  findAvailablePayrollSignatures
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
router.post(
  "/assign-authority",
  auth,
  assignAuthority
);

// ======================================
// ✅ GET ALL SIGNATURES
// ======================================
router.get(
  "/get-all-authority",
  auth,
  getAllPayrollSignatures
);

router.get(
  "/get-all-authority-mapping",
  auth,
  findAvailablePayrollSignatures
);
module.exports = router;