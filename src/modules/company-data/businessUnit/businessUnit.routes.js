const router = require("express").Router();
// const router = express.Router();

const controller = require("./buisnessUnit.controller");
const auth = require("../../../middlewares/auth.middleware")
const uploadToS3 = require("../../../middlewares/s3Upload")
router.post(
  "/create-buinessUnit",
  auth,
  (req, res, next) => {
    // Single logo upload only
    uploadToS3("company-branding").single("logo")(req, res, err => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  controller.createBusinessUnit
);
router.get("/all-buinessUnit", auth,controller.getAllBusinessUnits);
router.get("/getOne-buinessUnit/:id", controller.getBusinessUnitById);
router.put("/update-buinessUnit/:id", controller.updateBusinessUnit);
router.delete("/delete-buinessUnit/:id", controller.deleteBusinessUnit);

module.exports = router;
