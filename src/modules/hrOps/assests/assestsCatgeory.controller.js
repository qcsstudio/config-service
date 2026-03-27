const AssetCategory = require("./assestsCatgeory.model");
const mongoose = require("mongoose")
exports.createAssetCategory = async (req, res) => {
  try {
    const {
      categoryName,
      assetName,
      brand,
      condition,
      description,
      acknowledgement,
      warranty,
      assetType,
      attributes,
      companyOfficeId,
    } = req.body;

    // ✅ BASIC VALIDATION
    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // ✅ SAFE OFFICE ARRAY
    const officeIds = companyOfficeId
      ? Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId]
      : [];

    // ✅ TRANSFORM ATTRIBUTES FROM FRONTEND
    const formattedAttributes = (attributes || []).map((field) => ({
      fieldName: field.fieldLabel || field.fieldName || "",
      type:
        field.inputValueType === "list"
          ? "dropdown"
          : field.inputValueType || field.type || "text",
      required: field.isMandatory ?? field.required ?? false,
      multiple: field.multiple ?? false,
      options: field.options || [],
    }));

    // ✅ CREATE DATA
    const assetCategory = new AssetCategory({
      categoryName,
      assetName,
      brand,
      condition,
      description,

      // ✅ convert string → boolean safely
      acknowledgement:
        acknowledgement === true || acknowledgement === "yes",

      warranty: warranty === true || warranty === "yes",

      // ✅ already string enum
      assetType: assetType || "physical",

      attributes: formattedAttributes,

      companyOfficeId: officeIds,
    });

    await assetCategory.save();

    return res.status(201).json({
      success: true,
      message: "Asset Category created successfully",
      data: assetCategory,
    });
  } catch (error) {
    console.error("CREATE ASSET CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
exports.getAllAssetCategories = async (req, res) => {
    try {

        const companyId = req.user?.companyId;
        const categories = await AssetCategory.find({companyId:companyId}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getOneAssetCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await AssetCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Asset Category not found"
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.updateAssetCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Asset Category ID",
      });
    }

    const {
      categoryName,
      assetName,
      brand,
      condition,
      description,
      acknowledgement,
      warranty,
      assetType,
      attributes,
    } = req.body;

    // ✅ TRANSFORM ATTRIBUTES
    const formattedAttributes = (attributes || []).map((field) => ({
      fieldName: field.fieldLabel || field.fieldName || "",
      type:
        field.inputValueType === "list"
          ? "dropdown"
          : field.inputValueType || field.type || "text",
      required: field.isMandatory ?? field.required ?? false,
      multiple: field.multiple ?? false,
      options: field.options || [],
    }));

    // ✅ BUILD UPDATE OBJECT (avoid undefined overwrite)
    const updateData = {};

    if (categoryName !== undefined) updateData.categoryName = categoryName;
    if (assetName !== undefined) updateData.assetName = assetName;
    if (brand !== undefined) updateData.brand = brand;
    if (condition !== undefined) updateData.condition = condition;
    if (description !== undefined) updateData.description = description;

    if (acknowledgement !== undefined) {
      updateData.acknowledgement =
        acknowledgement === true || acknowledgement === "yes";
    }

    if (warranty !== undefined) {
      updateData.warranty =
        warranty === true || warranty === "yes";
    }

    if (assetType !== undefined) {
      updateData.assetType = assetType;
    }

    if (attributes !== undefined) {
      updateData.attributes = formattedAttributes;
    }

    // ✅ UPDATE
    const updatedCategory = await AssetCategory.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Asset Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Asset Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("UPDATE ASSET CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.deleteAssetCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await AssetCategory.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            data: category
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

