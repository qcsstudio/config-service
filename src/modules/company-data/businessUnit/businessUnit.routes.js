const router = require("express").Router();
// const router = express.Router();

const controller = require("./buisnessUnit.controller");
const auth = require("../../../middlewares/auth.middleware")

router.post("/create-buinessUnit",auth, controller.createBusinessUnit);
router.get("/all-buinessUnit", controller.getAllBusinessUnits);
router.get("/getOne-buinessUnit/:id", controller.getBusinessUnitById);
router.put("/update-buinessUnit/:id", controller.updateBusinessUnit);
router.delete("/delete-buinessUnit/:id", controller.deleteBusinessUnit);

module.exports = router;
