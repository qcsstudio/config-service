const express = require("express");
const router = express.Router();

const { saveCommonAccess, getCommonAccessById } = require("./commonAccess.controller");
const auth = require("../../../middlewares/auth.middleware"); // your token middleware

// 🔹 CREATE (First Time)
router.post(
  "/common-access",
  auth,
  saveCommonAccess
);
router.get(
  "/common-access-get",
  auth,
  getCommonAccessById
);

module.exports = router;
