const Template = require("./template.model"); // Adjust path
const mongoose = require("mongoose");

// CREATE TEMPLATE
exports.createTemplate = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;
    const { category, templateName, letterContent, email, companyOfficeId } = req.body;

    // Ensure companyOfficeId is always an array
    let officeIds = [];
    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId) ? companyOfficeId : [companyOfficeId];
    }
     const emailData = {
      subject: email?.subject || "",
      body: email?.body || "",
    };

    const template = new Template({
      companyId,
      adminId,
      category,
      templateName,
      letterContent: letterContent || "",
     email: emailData,
    companyOfficeId: officeIds, // store as array // store as array
    });

    await template.save();

    res.status(201).json({ success: true, data: template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL TEMPLATES (with optional filters)
exports.getAllTemplates = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const { country } = req.query; 
    let filter = { isDeleted: false };
    if (companyId) filter.companyId = companyId;

    const templates = await Template.find(filter)
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
        select: "officeName address.country address.state address.city",
      });

    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ONE TEMPLATE BY ID
exports.getTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({ success: false, message: "Invalid template ID" });
    }

    const template = await Template.findById(templateId)

    if (!template || template.isDeleted) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }

    res.status(200).json({ success: true, data: template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE TEMPLATE BY ID
exports.updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    let {
      category,
      templateName,
      letterContent,
      email,
      companyOfficeId,
      status,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({ success: false, message: "Invalid template ID" });
    }

    // Normalize companyOfficeId to always be an array
    let officeIds = [];
    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId) ? companyOfficeId : [companyOfficeId];
    }

    // Normalize email
    const emailData = {
      subject: email?.subject || "",
      body: email?.body || "",
    };

    // Build the update object
    const updateFields = {};
    if (category !== undefined) updateFields.category = category;
    if (templateName !== undefined) updateFields.templateName = templateName;
    if (letterContent !== undefined) updateFields.letterContent = letterContent;
    if (email !== undefined) updateFields.email = emailData;
    if (companyOfficeId !== undefined) updateFields.companyOfficeId = officeIds;
    if (status !== undefined) updateFields.status = status;

    let template;

    if (Object.keys(updateFields).length === 0) {
      // No fields provided, return existing template
      template = await Template.findById(templateId);
    } else {
      // Perform update
      template = await Template.findByIdAndUpdate(templateId, updateFields, { new: true });
    }

    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }

    res.status(200).json({ success: true, data: template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// SOFT DELETE TEMPLATE
exports.deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({ success: false, message: "Invalid template ID" });
    }

    const template = await Template.findByIdAndUpdate(templateId, { isDeleted: true }, { new: true });

    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }

    res.status(200).json({ success: true, message: "Template deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};