const express = require("express");
const router = express.Router();

const auth = require("../../../middlewares/auth.middleware");

const {
  createExitReason,
  Exit_reason_update
} = require("./ExitReason.controller");

router.post(
  "/create-exit-reason",
  auth,
  createExitReason
);

router.patch(
  "/exit-reason-status/:id",
  // auth,
  Exit_reason_update
);

module.exports = router;
