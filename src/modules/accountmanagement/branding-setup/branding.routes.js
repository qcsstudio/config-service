const router = require("express").Router();
const controller = require("./branding.controller");
const auth = require("../../../middlewares/auth.middleware");
const { allowRoles } = require("../../../middlewares/role.middleware");

// POST /branding => upload files and create/update branding
router.post(
  "/branding",
  auth,
  allowRoles("SUPER_ADMIN", "COMPANY_ADMIN"),
  (req, res, next) => {
    controller.brandingUpload(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  controller.createOrUpdateBranding
);

// GET /branding => get branding info
router.get(
  "/branding",
  auth,
  allowRoles("SUPER_ADMIN", "COMPANY_ADMIN", "EMPLOYEE"),
  controller.getBranding
);

module.exports = router;
