const express = require("express");
const router = express.Router();

const assetCategoryController = require("./assestsCatgeory.controller");
const auth = require("../../../middlewares/auth.middleware");

// CREATE
router.post(
    "/create-asset-category",
    auth,
    assetCategoryController.createAssetCategory
);

// GET ALL
router.get(
    "/getAll-asset-category",
    auth,
    assetCategoryController.getAllAssetCategories
);

// GET ONE
router.get(
    "/getOne-asset-category/:id",
    assetCategoryController.getOneAssetCategory
);

// UPDATE
router.put(
    "/update-asset-category/:id",
    assetCategoryController.updateAssetCategory
);
router.delete(
    "/delete-asset-category/:id",
    assetCategoryController.deleteAssetCategory
);

module.exports = router;
