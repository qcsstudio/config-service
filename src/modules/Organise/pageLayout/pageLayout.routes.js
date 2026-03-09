const express = require("express");
const router = express.Router();

const pageLayoutController = require("./pageLayout.controller");

// auth middleware
const auth = require("../../../middlewares/auth.middleware");

// S3 upload middleware
const uploadToS3 = require("../../../middlewares/s3Upload");


// Create or Update Page Layout
router.post(
  "/page-layout",
  auth,
  (req, res, next) => {
    uploadToS3("page-layout").fields([
      { name: "headerImage", maxCount: 1 },
      { name: "footerImage", maxCount: 1 }
    ])(req, res, err => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  pageLayoutController.createOrUpdatePageLayout
);


// Get Page Layout
router.get(
  "/page-layout-getOne",
  auth,
  pageLayoutController.getOnePageLayout
);

module.exports = router;