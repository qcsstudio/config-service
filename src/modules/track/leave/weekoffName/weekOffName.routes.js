const express = require("express");
const router = express.Router();

const {
  createWeeklyOff,
  getAllWeeklyOff,
  updateWeeklyOff,
  deleteWeeklyOff,
  getWeeklyOffById
} = require("./weekOffName.controller");

// If you have auth middleware
const auth = require("../../../../middlewares/auth.middleware");

router.post("/weekOff/create", auth, createWeeklyOff);

router.get("/getAll/weekoff",auth,  getAllWeeklyOff);
router.get("/getOne/weekoff/:id",  getWeeklyOffById);

// ✅ Update
router.put("/weekly-off-update/:id", updateWeeklyOff);


// ✅ Soft Delete
router.delete("/weekly-off-delete/:id", deleteWeeklyOff);
module.exports = router;