const express = require("express");
const router = express.Router();

const auth  = require("../../../middlewares/auth.middleware");
const { createOrUpdateEmployeeIdConfig, getEmployeeIdConfig } = require("./employeeid.controller");
// const { allowRoles } = require("../../../middlewares/role.middleware");


router.post(
  "/employee-id-config",
  auth,
//   allowRoles("COMPANY_ADMIN"),
  createOrUpdateEmployeeIdConfig
);

router.get(
  "/employee-id-config-get/:id",
  // auth,
//   allowRoles("COMPANY_ADMIN"),
  getEmployeeIdConfig
);

module.exports = router;
