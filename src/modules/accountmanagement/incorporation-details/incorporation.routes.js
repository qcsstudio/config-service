const router = require("express").Router();
const controller = require("./incorporation-controller");
const auth = require("../../../middlewares/auth.middleware");
const { allowRoles } = require("../../../middlewares/role.middleware");

// Create a new incorporation
router.post(
  "/incorporation",
  auth,
 allowRoles("COMPANY_ADMIN"),
  controller.createIncorporation
);

// Get a single incorporation by ID
router.get(
  "/incorporation-get/:id",
  auth,
 allowRoles("COMPANY_ADMIN"),
  controller.getIncorporationById
);

module.exports = router;
