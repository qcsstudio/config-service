const ExtraTime = require("./extraTime.model"); // adjust path as needed
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

exports.createExtraTimePolicy = async (req, res) => {
  try {
    const userId = req.user?.userId;
 const companyId = req.user?.companyId
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    const {
      policyName,
      policyDescription = "",
      workingDayBenefits = {},
      nonWorkingDayBenefits = {},
      extraTimePolicy = {},
      status = "draft",
      companyOfficeId,
    } = req.body;
let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }
    // ✅ Validate policy name
    if (!policyName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Policy name is required",
      });
    }

    // ✅ Check duplicate for SAME ADMIN only
    const existingPolicy = await ExtraTime.findOne({
      policyName: policyName.trim(),
      adminId: userId,
    });

    if (existingPolicy) {
      return res.status(400).json({
        success: false,
        message: "Policy name already exists",
      });
    }

    // ✅ Create policy
    const policy = await ExtraTime.create({
      policyName: policyName.trim(),
      policyDescription,
      workingDayBenefits,
      nonWorkingDayBenefits,
      extraTimePolicy,
      status,
      adminId: userId,     // ✅ correct field
      updatedBy: userId,
      companyId,
      companyOfficeId: officeIds,
    });

    return res.status(201).json({
      success: true,
      message: "Extra Time policy created successfully",
      data: policy,
    });

  } catch (error) {
    console.error("Create Extra Time Policy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAllExtraTimePolicies = async (req, res) => {
  try {
    const companyId = req.user?.companyId
    const policies = await ExtraTime.find({companyId :companyId, isDeleted:false }).sort({ createdAt: -1 }); // latest first
    const data = await populateEmployeeDetails(policies);
    return res.status(200).json({
      success: true,
      message: "All Extra Time policies fetched",
      data,
    });
  } catch (error) {
    console.error("Get All Policies Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.getExtraTimePolicyById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find policy
    const policy = await ExtraTime.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    // ✅ Populate employee details (same as your list API)
    const data = await populateEmployeeDetails([policy]);

    return res.status(200).json({
      success: true,
      message: "Extra Time policy fetched successfully",
      data: data[0], // return single object
    });

  } catch (error) {
    console.error("Get Policy By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.updateExtraTimePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await ExtraTime.findOne({
      _id: id
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    const {
      policyName,
      policyDescription,
      workingDayBenefits,
      nonWorkingDayBenefits,
      extraTimePolicy,
      status,
    } = req.body;

    // ✅ Name validation
    if (policyName && !policyName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Policy name cannot be empty"
      });
    }

    // ✅ Unique check
    if (policyName && policyName.trim() !== existing.policyName) {
      const duplicate = await ExtraTime.findOne({
        policyName: policyName.trim(),
        companyId: existing.companyId
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Policy name already exists"
        });
      }
    }

    // ✅ Handle officeIds
  

    // ✅ SAFE UPDATE (no overwrite)
    if (policyName) existing.policyName = policyName.trim();
    if (policyDescription !== undefined) existing.policyDescription = policyDescription;

    if (workingDayBenefits) {
      existing.workingDayBenefits = {
        ...existing.workingDayBenefits.toObject(),
        ...workingDayBenefits
      };
    }

    if (nonWorkingDayBenefits) {
      existing.nonWorkingDayBenefits = {
        ...existing.nonWorkingDayBenefits.toObject(),
        ...nonWorkingDayBenefits
      };
    }

    if (extraTimePolicy) {
      existing.extraTimePolicy = {
        ...existing.extraTimePolicy.toObject(),
        ...extraTimePolicy
      };
    }

    if (status !== undefined) existing.status = status;



    await existing.save();

    return res.status(200).json({
      success: true,
      message: "Extra Time policy updated successfully",
      data: existing
    });

  } catch (error) {
    console.error("Update Extra Time Policy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

exports.deleteExtraTimePolicy = async (req, res) => {
  try {
    const { id } = req.params;


    const policy = await ExtraTime.findOne({
      _id: id,
      isDeleted: false
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    policy.isDeleted = true;
    policy.deletedAt = new Date();
    await policy.save();

    return res.status(200).json({
      success: true,
      message: "Policy deleted successfully (soft)"
    });

  } catch (error) {
    console.error("Delete Extra Time Policy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};