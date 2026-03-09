const express = require("express");
const router = express.Router();

const policyController = require("./PolicyCenter.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");
const uploadToS3 = require("../../../middlewares/s3Upload");


// 🔹 Get Business Units OR Departments
router.get(
  "/get-cluster",
  authMiddleware,
  policyController.getBusinessUnitOrDepartment
);


// 🔹 Create Policy (S3 Upload)
router.post(
  "/create-policy-center",
  authMiddleware,
  uploadToS3().single("file"),
  policyController.createPolicy
);


// 🔹 Get All Policies
router.get(
  "/get-policies-center",
  authMiddleware,
  policyController.getPolicies
);


// 🔹 Get Single Policy
router.get(
  "/get-policy-center/:policyId",
  authMiddleware,
  policyController.getPolicy
);


// 🔹 Update Policy
router.put(
  "/update-policy-center/:policyId",
  authMiddleware,
  uploadToS3().single("file"),
  policyController.updatePolicy
);


// 🔹 Delete Policy (Soft Delete)
router.patch(
  "/delete-policy-center/:policyId",
  authMiddleware,
  policyController.deletePolicy
);


module.exports = router;