const express = require("express");
const router = express.Router();

const {
  createSalaryStructure,
  getAllSalaryStructures,
  getOneSalaryStructure,
  updateSalaryStructure,
    deleteSalaryStructure,
} = require("./salaryStructure.controller");

const auth = require("../../../../middlewares/auth.middleware"); // adjust path if different

// 🔹 Create Salary Structure
router.post(
  "/create-salaryStructure",
  auth ,
  createSalaryStructure
);

// 🔹 Get All Salary Structures
// Example: /api/salary-structure?country=India
router.get(
  "/get-ALL_salaryStructure",
 auth ,
  getAllSalaryStructures
);
router.put(
  "/update-salary-structure/:id",
  auth,
  updateSalaryStructure
);
router.get("/get-salary-structure/:id", auth, getOneSalaryStructure);
router.delete("/salary-structure/:id", deleteSalaryStructure);
module.exports = router;