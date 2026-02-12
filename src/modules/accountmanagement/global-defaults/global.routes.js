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
  allowRoles("COMPANY_ADMIN"),
  controller.createOrUpdateGlobal
);

// Get global settings
router.get(
  "/global-settings-get",
  auth,
   allowRoles("COMPANY_ADMIN"),
  controller.getGlobalSettings
);

module.exports = router;
