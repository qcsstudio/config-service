const CustomDataSection = require("./customData.model");

// CREATE
const createCustomDataSection = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      sectionName,
      classifyUnderEmployeeIdentity,
      includeMandatoryExpiryDate,
      pushNotificationOnExpiry,
      editRights,
      customFields
    } = req.body;

    if (!sectionName) {
      return res.status(400).json({ message: "Section name is required" });
    }

    if (!customFields || customFields.length === 0) {
      return res.status(400).json({ message: "Custom fields are required" });
    }

    const duplicateKeys = new Set();
    const processedFields = [];

    for (let field of customFields) {

      if (!field.fieldLabel || !field.inputValueType) {
        return res.status(400).json({
          message: "Each custom field must have label and input type",
        });
      }

      // 🔥 Auto-generate fieldKey from fieldLabel
      const generatedKey = field.fieldLabel
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^\w]/g, "");

      if (duplicateKeys.has(generatedKey)) {
        return res.status(400).json({
          message: `Duplicate field generated: ${generatedKey}`,
        });
      }

      duplicateKeys.add(generatedKey);

      processedFields.push({
        fieldLabel: field.fieldLabel,
        fieldKey: generatedKey,
        inputValueType: field.inputValueType,
        isMandatory: field.isMandatory || false
      });
    }

    const newSection = await CustomDataSection.create({
      adminId,
      addedbyid: adminId,
      sectionName,
      classifyUnderEmployeeIdentity,
      includeMandatoryExpiryDate,
      pushNotificationOnExpiry,
      editRights,
      customFields: processedFields
    });

    res.status(201).json({
      message: "Custom data section created successfully",
      data: newSection,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL
const getAllCustomDataSections = async (req, res) => {
  try {

    const sections = await CustomDataSection.find({  })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: sections.length,
      data: sections,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateCustomDataSection = async (req, res) => {
  try {
    // const adminId = req.user?.userId;
    const { id } = req.params;

    const existingSection = await CustomDataSection.findOne({
      _id: id,
    });

    if (!existingSection) {
      return res.status(404).json({ message: "Section not found" });
    }

    const {
      sectionName,
      classifyUnderEmployeeIdentity,
      includeMandatoryExpiryDate,
      pushNotificationOnExpiry,
      editRights,
      customFields,
      fieldValues,
      isActive,
    } = req.body;

    // 🔒 Prevent fieldKey update
    if (customFields && customFields.length > 0) {
      for (let newField of customFields) {
        const oldField = existingSection.customFields.find(
          (f) => f.fieldKey === newField.fieldKey
        );

        if (!oldField) {
          return res.status(400).json({
            message: `fieldKey cannot be modified or newly added: ${newField.fieldKey}`,
          });
        }
      }

      existingSection.customFields = customFields;
    }

    // Update normal fields
    existingSection.sectionName = sectionName ?? existingSection.sectionName;
    existingSection.classifyUnderEmployeeIdentity =
      classifyUnderEmployeeIdentity ??
      existingSection.classifyUnderEmployeeIdentity;
    existingSection.includeMandatoryExpiryDate =
      includeMandatoryExpiryDate ??
      existingSection.includeMandatoryExpiryDate;
    existingSection.pushNotificationOnExpiry =
      pushNotificationOnExpiry ??
      existingSection.pushNotificationOnExpiry;
    existingSection.editRights = editRights ?? existingSection.editRights;
    existingSection.fieldValues = fieldValues ?? existingSection.fieldValues;
    existingSection.isActive = isActive ?? existingSection.isActive;

    await existingSection.save();

    res.status(200).json({
      message: "Section updated successfully",
      data: existingSection,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteCustomDataSection = async (req, res) => {
  try {

    const { id } = req.params;

    const deleted = await CustomDataSection.findOneAndDelete({
      _id: id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.status(200).json({
      message: "Section deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCustomDataSectionStatus = async (req, res) => {
  try {
  
    const { id, isActive } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Section ID is required" });
    }

    if (typeof isActive === "undefined") {
      return res.status(400).json({ message: "isActive value is required" });
    }

    // Convert string to boolean
    const statusValue =
      isActive === "true" ? true :
      isActive === "false" ? false :
      null;

    if (statusValue === null) {
      return res.status(400).json({
        message: "isActive must be true or false"
      });
    }

    const updated = await CustomDataSection.findOneAndUpdate(
      { _id: id},
      { isActive: statusValue },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Section not found"
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createCustomDataSection,
  getAllCustomDataSections,
  updateCustomDataSection,
  deleteCustomDataSection,
updateCustomDataSectionStatus,
};