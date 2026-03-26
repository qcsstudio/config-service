const express = require("express");
const router = express.Router();

const workflowController = require("./approvalWorkflow.controller");
const auth = require("../../../middlewares/auth.middleware");

// Create or Update Workflow (tab based)
router.post(
  "/createWorkflow",
  auth,
  workflowController.createWorkflow
);
router.put(
  "/update-approvalWorkflow",
  auth,
  workflowController.updateWorkflow
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
router.delete(
  "/approvalWorkflow-delete/:id",
  // auth,
  workflowController.deleteWorkflow
);
module.exports = router;