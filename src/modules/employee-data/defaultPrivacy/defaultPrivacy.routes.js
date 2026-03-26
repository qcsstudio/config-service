const express = require("express");
const router = express.Router();

const {
  createOrUpdateDefaultPrivacy,
  getDefaultPrivacy
} = require("./defaultPrivacy.controller");
const auth = require("../../../middlewares/auth.middleware")
// 🔐 add auth middleware if needed
router.post("/createOrUpdate-default-privacy",auth, createOrUpdateDefaultPrivacy);
router.get("/getAlldefault-privacy",auth ,getDefaultPrivacy );


module.exports = router;