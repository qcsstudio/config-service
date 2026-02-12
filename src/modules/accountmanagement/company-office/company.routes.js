const router = require("express").Router();
const controller = require("./company.controller");
const auth = require("../../../middlewares/auth.middleware");
const { allowRoles } = require("../../../middlewares/role.middleware");

/* ===============================
   COMPANY OFFICES
================================ */

// Create a new company office
router.post(
  "/company-office",
  auth,
  allowRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  controller.createCompanyOffice
);

// Update an existing company office
router.put(
  "/company-office/:id",
  auth,
  allowRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  controller.updateCompanyOffice
);

// Get a single company office
router.get(
  "/company-office/:id",
  auth,
  allowRoles("SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE"),
  controller.getCompanyOffice
);

// Get all company offices
router.get(
  "/company-offices",
  auth,
  allowRoles("SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE"),
  controller.getAllCompanyOffices
);

// Delete a company office
router.delete(
  "/company-office/:id",
  auth,
  allowRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  controller.deleteCompanyOffice
);

module.exports = router;
