const express = require("express");
const router = express.Router();

const { createFeature, upsertRolePermission } = require("./defaultPermission.controller");
const auth = require("../../../middlewares/auth.middleware");
// create feature
router.post("/create-feature", createFeature);
router.post("/set-role-permission",auth, upsertRolePermission);

module.exports = router;