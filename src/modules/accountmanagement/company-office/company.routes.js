const router = require("express").Router();
const controller = require("./company.controller");
const auth = require("../../../middlewares/auth.middleware");
const { allowRoles } = require("../../../middlewares/role.middleware");

/* ===============================
   COMPANY OFFICES
================================ */

// 🔐 Create
router.post(
  "/company-office",
  auth,
   allowRoles("COMPANY_ADMIN"),
  controller.createCompanyOffice
);

// 🔐 Update
router.put(
  "/company-office-edit/:id",
  // auth,
  // allowRoles("COMPANY_ADMIN"),
  controller.updateCompanyOffice
);

// 🔓 Get single office (NO AUTH)
router.get(
  "/company-office-get/:id",
  auth,
  controller.getCompanyOffice
);

// 🔓 Get all offices (NO AUTH)
router.get(
  "/company-offices-getAll",
  auth,
  allowRoles("COMPANY_ADMIN"),
  controller.getAllCompanyOffices
);


// 🔐 Delete
router.delete(
  "/company-office-delete/:id",
  auth,
  // allowRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  controller.deleteCompanyOffice
);
router.get(
  "/company-offices-data",
  auth,
  controller.getCompanyOfficeData
);

module.exports = router;
