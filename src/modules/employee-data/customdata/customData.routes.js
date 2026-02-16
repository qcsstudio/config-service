const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const customData = require("./customData.controller");
router.post("/create-customData",auth, customData.createCustomDataSection);
router.get("/get-all-customData", customData.getAllCustomDataSections);
router.put("/update-customData/:id", customData.updateCustomDataSection);
router.delete("/delete-customData/:id", customData.deleteCustomDataSection);
router.put("/custom-data/status/:id", customData.updateCustomDataSectionStatus);

module.exports = router;
