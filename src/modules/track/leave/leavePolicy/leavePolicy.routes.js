const express = require("express");
const router = express.Router();

const {
  createLeavePolicy,
  getAllLeavePolicies,
  getOneLeavePolicy,
  updateLeavePolicy,
} = require("./leavePolicy.controller");

router.post("/create/leavePolicy", createLeavePolicy);
router.get("/getAll/leavePolicy", getAllLeavePolicies);
router.get("/ge/leavePolicy/:id", getOneLeavePolicy);
router.put("/update/leavePolicy/:id", updateLeavePolicy);

module.exports = router;