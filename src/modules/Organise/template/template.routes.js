// routes/templateRoutes.js
const express = require("express");
const router = express.Router();
const templateController = require("./template.controller"); // Adjust path
const authMiddleware = require("../../../middlewares/auth.middleware") // Adjust path if needed

// CREATE TEMPLATE
router.post("/create-template", authMiddleware, templateController.createTemplate);

// GET ALL TEMPLATES (with optional country filter)
router.get("/getAll-template", authMiddleware, templateController.getAllTemplates);

// GET ONE TEMPLATE BY ID
router.get("/getOne-template/:templateId", templateController.getTemplateById);

// UPDATE TEMPLATE BY ID
router.put("/update-template/:templateId", templateController.updateTemplate);

// SOFT DELETE TEMPLATE BY ID
router.put("/delete-template/:templateId", templateController.deleteTemplate);

module.exports = router;