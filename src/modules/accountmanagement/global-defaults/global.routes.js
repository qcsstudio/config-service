const router = require("express").Router();
const controller = require("./global.controller");
const auth = require("../../../middlewares/auth.middleware");
const { allowRoles } = require("../../../middlewares/role.middleware");

/* ===============================
   GLOBAL SETTINGS
================================ */

// Create or update global settings
router.post(
  "/global-settings",
  auth,
  allowRoles("SUPER_ADMIN"), 
  controller.createOrUpdateGlobal
);

// Get global settings
router.get(
  "/global-settings",
  auth,
  allowRoles("SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE"),
  controller.getGlobalSettings
);

module.exports = router;
