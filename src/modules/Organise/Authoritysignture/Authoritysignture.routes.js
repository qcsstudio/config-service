const express = require("express");
const router = express.Router();

const authorityController = require("./Authoritysignture.contoller");
const authMiddleware = require("../../../middlewares/auth.middleware"); 
const uploadToS3 = require("../../../middlewares/s3Upload"); 

// Create Authority Signature
router.post(
  "/create",
  authMiddleware,
  uploadToS3().single("signatureImage"),
  authorityController.createAuthoritySignature
);

// Get All Authority Signatures
router.get(
  "/get-all",
  authMiddleware,
  authorityController.getAllAuthoritySignatures
);

// Get One Authority Signature
router.get(
  "/get-one/:id",
  authorityController.getOneAuthoritySignature
);

// Update Authority Signature
router.put(
  "/update/:id",
   uploadToS3().single("signatureImage"),
  authorityController.updateAuthoritySignature
);

// Delete Authority Signature (Soft Delete)
router.delete(
  "/delete/:id",
  authorityController.deleteAuthoritySignature
);

module.exports = router;