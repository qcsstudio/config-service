const express = require("express");
const router = express.Router();

const {
  createPolicy,
  updatePolicy,
  getPolicyById,
  deletePolicy,
  getPoliciesByCompany
} = require("./expensePolicy.controller");
const auth =require("../../../../middlewares/auth.middleware")
// CREATE POLICY
router.post("/create-expensePolicy", auth,createPolicy);

// UPDATE POLICY
router.put("/update/expensePolicy/:id", updatePolicy);

// GET ALL POLICIES BY COMPANY
router.get("/GetAll/expensePolicy",auth, getPoliciesByCompany);

// GET SINGLE POLICY
router.get("/getOne/expensePolicy/:id", getPolicyById);

// SOFT DELETE POLICY
// SOFT DELETE POLICY
router.patch("/delete-expensePolicy/:id", deletePolicy);

module.exports = router;