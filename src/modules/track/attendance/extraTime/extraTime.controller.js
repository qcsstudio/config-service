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
    const policies = await ExtraTime.find({companyId :companyId }).sort({ createdAt: -1 }); // latest first
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