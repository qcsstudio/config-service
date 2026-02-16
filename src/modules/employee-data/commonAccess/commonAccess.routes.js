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

// 🔹 UPDATE (By ID only)
router.put(
  "/common-access/:id",
  saveCommonAccess   // if you don't want adminId check
);
router.get(
  "/common-access/:id",
  getCommonAccessById
);

module.exports = router;
