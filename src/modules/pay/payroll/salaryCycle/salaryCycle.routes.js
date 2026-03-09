const express = require("express");
const router = express.Router();

const {
  createSalaryCycle,
  getSalaryCycle,
} = require("./salaryCycle.controller");

const auth = require("../../../../middlewares/auth.middleware");

// CREATE SALARY CYCLE
router.post("/create-salary-cycle", auth, createSalaryCycle);

// GET SALARY CYCLE
router.get("/getSalary-cycle", auth, getSalaryCycle);

module.exports = router;