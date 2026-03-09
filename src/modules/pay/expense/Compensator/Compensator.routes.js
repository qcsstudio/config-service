const express = require("express");
const router = express.Router();

const compensatorController = require("./Compensator.controller");
const auth = require("../../../../middlewares/auth.middleware")
// CREATE
router.post(
  "/create-compensatore",auth,
  compensatorController.createCompensatorConfiguration
);

// GET ALL
router.get(
  "/getAll-compensatore",auth,
  compensatorController.getAllCompensatorConfiguration
);

// GET ONE
router.get(
  "/getOne-compensatore/:id",
  compensatorController.getCompensatorConfigurationById
);

// UPDATE
router.put(
  "/update-compensatore/:id",
  compensatorController.updateCompensatorConfiguration
);

// DELETE
router.patch(
  "/delete-compensatore/:id",
  compensatorController.deleteCompensatorConfiguration
);

module.exports = router;