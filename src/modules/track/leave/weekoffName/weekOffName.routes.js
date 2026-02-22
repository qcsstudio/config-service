const express = require("express");
const router = express.Router();

const {
  createWeeklyOff,
  getAllWeeklyOff,
} = require("./weekOffName.controller");

// If you have auth middleware
const auth = require("../../../../middlewares/auth.middleware");

router.post("/weekOff/create", auth, createWeeklyOff);

router.get("/getAll/weekoff",  getAllWeeklyOff);

module.exports = router;