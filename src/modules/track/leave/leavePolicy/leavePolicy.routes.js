const express = require("express");
const router = express.Router();

const {
  createLeavePolicy,
  getAllLeavePolicies,
  getOneLeavePolicy,
  updateLeavePolicy,
  deleteLeavePolicy
} = require("./leavePolicy.controller");
const auth = require("../../../../middlewares/auth.middleware")
router.post("/create/leavePolicy",auth, createLeavePolicy);
router.get("/getAll/leavePolicy",auth, getAllLeavePolicies);
router.get("/get/leavePolicy/:id", getOneLeavePolicy);
router.put("/update/leavePolicy/:id", updateLeavePolicy);
router.delete("/leavePolicydelete/:id",deleteLeavePolicy );
module.exports = router;