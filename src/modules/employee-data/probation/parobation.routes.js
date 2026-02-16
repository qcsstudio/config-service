const express = require("express");
const router = express.Router();
const {
  createOrUpdateProbationPlan,
  getAllProbationPlans,
  getProbationPlanById,
  deleteProbationPlan,
} = require("./probation.controller");
const auth = require("../../../middlewares/auth.middleware");

router.post("/create-probation", auth, createOrUpdateProbationPlan);
router.get("/probation-getAll",  getAllProbationPlans);
router.get("/probation-get/:id", getProbationPlanById);
router.delete("/delete-probation/:id",  deleteProbationPlan);

module.exports = router;