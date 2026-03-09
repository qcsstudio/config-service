const express = require("express");
const router = express.Router();
const fuelController = require("./fuelConfiguration.controller");
const auth = require("../../../../middlewares/auth.middleware")
router.post("/createOrupdate/fuel-config", auth ,fuelController.createOrUpdateFuelConfiguration);

router.get(
  "/fuel-config-Getone",auth ,
  fuelController.getFuelConfigurationByCompany
);

module.exports = router;