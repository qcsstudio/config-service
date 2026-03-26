const DefaultPrivacy = require("./defaultPrivacy.model"); // adjust path

exports.createOrUpdateDefaultPrivacy = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const { permissions } = req.body;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    if (!permissions || typeof permissions !== "object") {
      return res.status(400).json({
        success: false,
        message: "Permissions object is required",
      });
    }

    // ✅ Allowed fields (same as schema)
    const allowedFields = [
      "personalData",
      "about",
      "address",
      "contact",
      "biodata",
      "importantDates",
      "dependents",
      "medical",
      "identity",
      "banking",
      "skills",
      "language",
      "workExperienceDetails",
      "educationDetails",
      "documents",
    ];

    // ✅ Clean payload (avoid extra keys)
    const cleanPermissions = {};
    allowedFields.forEach((field) => {
      if (permissions.hasOwnProperty(field)) {
        cleanPermissions[field] = permissions[field];
      }
    });

    // ✅ UPSERT (create or update)
    const result = await DefaultPrivacy.findOneAndUpdate(
      { companyId },
      {
        $set: {
          permissions: cleanPermissions,
          adminId,
          companyId,
        },
      },
      {
        new: true,
        upsert: true, // 🔥 important
      }
    );

    return res.status(200).json({
      success: true,
      message: "Privacy settings saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in createOrUpdateDefaultPrivacy:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.getDefaultPrivacy = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    const data = await DefaultPrivacy.findOne({ companyId });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching data",
    });
  }
};