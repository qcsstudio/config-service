const express = require("express");
const router = express.Router();

const fnfPolicyController = require("./fnfPolicy.controller");
const authMiddleware = require("../../../../middlewares/auth.middleware");

/* =========================
   FNF POLICY ROUTES
========================= */

router.post(
  "/create/fnf-policy",
  authMiddleware,
  fnfPolicyController.createFnfPolicy
);

router.get(
  "/get-all/fnf-policies",
  authMiddleware,
  fnfPolicyController.getAllFnfPolicies
);

router.get(
  "/get-one/fnf-policy/:id",
  authMiddleware,
  fnfPolicyController.getFnfPolicyById
);

router.put(
  "/update/fnf-policy/:id",
  authMiddleware,
  fnfPolicyController.updateFnfPolicy
);

router.delete(
  "/delete/fnf-policy/:id",
  authMiddleware,
  fnfPolicyController.deleteFnfPolicy
);

module.exports = router;