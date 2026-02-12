const router = require("express").Router();
const controller = require("./incorporation-controller");
const auth = require("../../../middlewares/auth.middleware");
const { allowRoles } = require("../../../middlewares/role.middleware");

// Create a new incorporation
router.post(
  "/incorporation",
  auth,
  allowRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  controller.createIncorporation
);

// Get a single incorporation by ID
router.get(
  "/incorporation/:id",
  auth,
  allowRoles("SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE"),
  controller.getIncorporationById
);

module.exports = router;
