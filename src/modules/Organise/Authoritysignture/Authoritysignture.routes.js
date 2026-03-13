const express = require("express");
const router = express.Router();

const authorityController = require("./Authoritysignture.contoller");
const authMiddleware = require("../../../middlewares/auth.middleware"); 
const uploadToS3 = require("../../../middlewares/s3Upload"); 

// Create Authority Signature
router.post(
  "/create-authoritySignature",
  authMiddleware,
  uploadToS3().single("signatureImage"),
  authorityController.createAuthoritySignature
);

// Get All Authority Signatures
router.get(
  "/get-all-authoritySignature",
  authMiddleware,
  authorityController.getAllAuthoritySignatures
);

// Get One Authority Signature
router.get(
  "/get-one-authoritySignature/:id",
  authorityController.getOneAuthoritySignature
);

// Update Authority Signature
router.put(
  "/update-authoritySignature/:id",
   uploadToS3().single("signatureImage"),
  authorityController.updateAuthoritySignature
);

// Delete Authority Signature (Soft Delete)
router.put(
  "/delete-authoritySignature/:id",
  authorityController.deleteAuthoritySignature
);

module.exports = router;