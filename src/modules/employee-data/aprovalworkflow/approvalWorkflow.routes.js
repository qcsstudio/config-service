const express = require("express");
const router = express.Router();

const workflowController = require("./approvalWorkflow.controller");
const auth = require("../../../middlewares/auth.middleware");

// Create or Update Workflow (tab based)
router.post(
  "/create-update-approvalWorkflow",
  auth,
  workflowController.createOrUpdateWorkflow
);

// Get Workflow By Id
router.get(
  "/approvalWorkflow-get/:id",
  // auth,
  workflowController.getWorkflow
);

router.get(
  "/approvalWorkflow-get-all",
  // auth,
  workflowController.getWorkflowAll
);

module.exports = router;