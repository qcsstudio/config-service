const express = require("express");
const router = express.Router();

const {
  createExpenseCycle,
  getExpenseCycleByCompany
} = require("./ExpenseCycle.controller");
const auth = require("../../../../middlewares/auth.middleware")
// Create or Update Expense Cycle
router.post("/createORupdate-expense-cycle",auth, createExpenseCycle);

// Get Expense Cycle by Company
router.get("/getOne-expense-cycle",auth, getExpenseCycleByCompany);

module.exports = router;