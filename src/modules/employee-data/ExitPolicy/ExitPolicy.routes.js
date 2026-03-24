const express = require("express");
const router = express.Router();

const {
  createExitPolicy,
  getAllExitPolicies,
  getOneExitPolicy,
  updateExitPolicy,
  deleteExitPolicy,
} = require("./ExitPolicy.controller");

const  verifyToken  = require("../../../middlewares/auth.middleware");

// ── Exit Policy Routes
router.post("/create-exit-policy", verifyToken, createExitPolicy);
router.get("/getAll-exit-policy", verifyToken, getAllExitPolicies);
router.get("/getOne-exit-policy/:id",  getOneExitPolicy);
router.put("/update-exit-policy/:id",  updateExitPolicy);
router.delete("/delete-exit-policy/:id", deleteExitPolicy);

module.exports = router;