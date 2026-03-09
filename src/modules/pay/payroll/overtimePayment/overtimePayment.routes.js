const express = require("express");
const router = express.Router();

const {
  createOrUpdateOvertimePolicy,
  getOvertimePolicy,
} = require("./overtimePayment.contoller");

const auth = require("../../../../middlewares/auth.middleware");

router.post(
  "/create-update-overtime-policy",
  auth,
  createOrUpdateOvertimePolicy
);

router.get(
  "/get-overtime-policy",
  auth,
  getOvertimePolicy
);

module.exports = router;